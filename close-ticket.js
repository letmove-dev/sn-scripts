(function () {
  var targetWin = document.getElementById("gsft_main")
    ? document.getElementById("gsft_main").contentWindow
    : window;
  var targetDoc = targetWin.document;
  var f = targetWin.g_form;

  if (targetWin.__tmp_loading) return;

  var oldBox = targetDoc.getElementById("tmp_modal_box");
  if (oldBox) oldBox.remove();
  var oldScript = document.getElementById("tmp_jsonp_script");
  if (oldScript) oldScript.remove();

  /* 1. ตรวจสอบประเภทหน้า */
  var tableName = (f && typeof f.getTableName === "function") ? f.getTableName() : "";
  var curPageUrl = (targetWin.location.href || "") + (window.location.href || "");
  var numVal = "";
  var numInput = targetDoc.querySelector('input[id*=".number"]');
  if (numInput) numVal = numInput.value;

  var isIncidentPage =
    tableName === "incident" ||
    curPageUrl.indexOf("incident.do") !== -1 ||
    numVal.indexOf("INC") !== -1 ||
    targetDoc.querySelector('input[id="incident.number"]') !== null;

  var isTaskPage =
    tableName === "sc_task" ||
    curPageUrl.indexOf("sc_task.do") !== -1 ||
    numVal.indexOf("SCTASK") !== -1;

  var isRitmPage =
    tableName === "sc_req_item" ||
    numVal.indexOf("RITM") !== -1 ||
    targetDoc.querySelector('textarea[id="sc_req_item.u_cancel_reason"]') !== null;

  /* ตรวจสอบเคสส่งค่าข้ามหน้าไปยัง RITM */
  var crBox = targetDoc.querySelector(
    'textarea[id="sc_req_item.u_cancel_reason"],textarea[name="sc_req_item.u_cancel_reason"]'
  );
  var pendingCancel = "";
  try {
    pendingCancel =
      window.top.__pending_cancel || localStorage.getItem("__pending_cancel") || "";
  } catch (e) {}

  if (crBox && pendingCancel) {
    try {
      window.top.__pending_cancel = "";
      localStorage.removeItem("__pending_cancel");
    } catch (e) {}
    if (f) {
      try { f.setValue("u_cancel_reason", pendingCancel); } catch (e) {}
    }
    crBox.value = pendingCancel;
    ["input", "change", "blur"].forEach(function (x) {
      crBox.dispatchEvent(new Event(x, { bubbles: true }));
    });
    return;
  }

  /* กรองหมวดหมู่ตามประเภทหน้า */
  var allowedCats = isIncidentPage
    ? ["Server slow", "Ticket Cancal", "Incident Request"]
    : ["Ticket Cancal", "Service Request"];

  function setValToElem(el, val) {
    if (!el) return;
    el.value = val;
    ["input", "change", "keydown", "keyup", "blur"].forEach(function (evt) {
      el.dispatchEvent(new Event(evt, { bubbles: true }));
    });
    try {
      if (targetWin.angular) {
        var ngEl = targetWin.angular.element(el);
        var scope = ngEl.scope();
        if (scope) {
          scope.$apply(function () {
            if (scope.data) scope.data.comments = val;
            if (scope.field) scope.field.value = val;
          });
        }
      }
    } catch (e) {}
  }

  function fillBySelectors(selectors, val) {
    for (var i = 0; i < selectors.length; i++) {
      var el = targetDoc.querySelector(selectors[i]);
      if (el) {
        setValToElem(el, val);
        return true;
      }
    }
    return false;
  }

  function getBJ() {
    var el = targetDoc.querySelector('textarea[id*="ni.VE"]');
    if (el && el.value && el.value.trim()) return el.value.trim();
    var L = targetDoc.querySelectorAll("label,span");
    for (var i = 0; i < L.length; i++) {
      if ((L[i].innerText || "").indexOf("Business Justification") !== -1) {
        var r = L[i].closest(".form-group") || L[i].parentElement;
        if (r) {
          var t = r.querySelector("textarea,input");
          if (t && t.value.trim()) return t.value.trim();
        }
      }
    }
    return "";
  }

  function getDesc() {
    var el =
      targetDoc.getElementById("incident.description") ||
      targetDoc.querySelector('textarea[name="incident.description"],textarea[id*="description"]');
    if (el && el.value && el.value.trim()) return el.value.trim();
    if (f) {
      try {
        var v = f.getValue("description");
        if (v && v.trim()) return v.trim();
      } catch (e) {}
    }
    return "";
  }

  function getBUFromCI() {
    var el =
      targetDoc.getElementById("sys_display.sc_task.cmdb_ci") ||
      targetDoc.querySelector('input[id="sys_display.sc_task.cmdb_ci"]');
    var c = el && el.value ? el.value.trim() : "";
    if (!c && f && typeof f.getDisplayValue === "function") {
      try { c = f.getDisplayValue("cmdb_ci") || ""; } catch (e) {}
    }
    if (c && c.indexOf(" - ") !== -1) {
      var p = c.split(" - ");
      return p[p.length - 1].trim();
    }
    return c;
  }

  function repDesc(t, b) {
    if (!b || !t) return t;
    var k = "Issue Description:";
    var p = t.indexOf(k);
    if (p === -1) return t;
    var ep = t.indexOf("Environment", p);
    return ep !== -1
      ? t.substring(0, p + k.length) + "\n" + b + "\n\n" + t.substring(ep)
      : t.substring(0, p + k.length) + "\n" + b;
  }

  function repBU(t, u) {
    if (!u || !t) return t;
    var lines = t.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].trim();
      if (s.indexOf("BU:") === 0 || s.indexOf("BU :") === 0) {
        lines[i] = "BU: " + u;
        break;
      }
    }
    return lines.join("\n");
  }

  /* URL Web App จาก Google Sheets ตัวเดิมที่เคยทำงานได้ปกติ */
  var webAppUrl = "https://script.google.com/a/macros/celestica.com/s/AKfycbzHghC3LKq_xMY0WN8Wwm20wXh247_8NETKbZegFjpv3uZRmdEUc5RSfhAne8Os27uX/exec";

  var div = targetDoc.createElement("div");
  div.id = "tmp_modal_box";
  div.style =
    "position:fixed;top:8%;left:50%;transform:translateX(-50%);width:540px;max-width:92%;background:#fff;border:2px solid #2563eb;z-index:9999999;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.35);border-radius:12px;font-family:sans-serif;box-sizing:border-box;";
  div.innerHTML =
    '<h3 style="margin:0 0 14px 0;color:#2563eb;border-bottom:1px solid #e2e8f0;padding-bottom:10px;font-size:17px;">ServiceNow Template Database</h3>' +
    '<label style="font-size:12px;color:#64748b;font-weight:bold;">1. Category:</label>' +
    '<select id="tmpCatSelect" style="width:100%;padding:10px;margin:6px 0 12px 0;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;background:#f8fafc;box-sizing:border-box;"><option>Loading...</option></select>' +
    '<label style="font-size:12px;color:#64748b;font-weight:bold;">2. Template:</label>' +
    '<select id="tmpItemSelect" style="width:100%;padding:10px;margin:6px 0 12px 0;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;background:#f8fafc;box-sizing:border-box;"><option>-- Wait --</option></select>' +
    '<label style="font-size:12px;color:#64748b;font-weight:bold;">Preview:</label>' +
    '<textarea id="tmpPreview" readonly style="width:100%;height:160px;margin:6px 0 16px 0;padding:10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;background:#f1f5f9;box-sizing:border-box;resize:vertical;font-family:monospace;">Loading data...</textarea>' +
    '<div style="text-align:right;"><button id="tmpCancel" style="padding:9px 18px;margin-right:8px;background:#e2e8f0;color:#334155;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">Cancel</button>' +
    '<button id="tmpOk" style="padding:9px 22px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">Insert Template</button></div>';

  targetDoc.body.appendChild(div);
  targetDoc.getElementById("tmpCancel").onclick = function () {
    targetWin.__tmp_loading = false;
    div.remove();
  };

  function populateUI(list) {
    targetWin.__tmp_loading = false;
    if (!list || !list.length) {
      alert("No template data");
      div.remove();
      return;
    }

    var catSelect = targetDoc.getElementById("tmpCatSelect");
    var itemSelect = targetDoc.getElementById("tmpItemSelect");
    var preview = targetDoc.getElementById("tmpPreview");

    catSelect.innerHTML = "";
    var catMap = {};

    list.forEach(function (item, idx) {
      var c = item.category || "General";
      var ok = allowedCats.some(function (a) {
        return a.toLowerCase().trim() === c.toLowerCase().trim();
      });
      if (ok) {
        if (!catMap[c]) catMap[c] = [];
        item.rowId = "row_" + idx;
        catMap[c].push(item);
      }
    });

    var keys = Object.keys(catMap);
    if (!keys.length) {
      alert("No template data for this page");
      div.remove();
      return;
    }

    keys.forEach(function (cat) {
      var opt = targetDoc.createElement("option");
      opt.value = cat;
      opt.innerText = "📁 " + cat;
      catSelect.appendChild(opt);
    });

    function updateSubItems() {
      itemSelect.innerHTML = "";
      var items = catMap[catSelect.value] || [];
      items.forEach(function (item) {
        var opt = targetDoc.createElement("option");
        opt.value = item.rowId;
        opt.innerText = item.name;
        itemSelect.appendChild(opt);
      });
      updatePreview();
    }

    function updatePreview() {
      var items = catMap[catSelect.value] || [];
      var matched = items.find(function (it) {
        return it.rowId === itemSelect.value;
      });
      var raw = matched ? matched.content : "";
      if (isIncidentPage) {
        raw = repDesc(raw, getDesc());
      } else if (catSelect.value.toLowerCase().indexOf("service request") !== -1) {
        raw = repBU(repDesc(raw, getBJ()), getBUFromCI());
      }
      preview.value = raw;
    }

    catSelect.onchange = updateSubItems;
    itemSelect.onchange = update
