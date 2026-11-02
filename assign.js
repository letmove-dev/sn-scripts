(function () {
  var w = document.getElementById("gsft_main")
    ? document.getElementById("gsft_main").contentWindow
    : window;
  var d = w.document;
  var f = w.g_form;

  function triggerEvents(el) {
    if (!el) return;
    var evts = ["input", "change", "keydown", "keyup", "blur"];
    for (var i = 0; i < evts.length; i++) {
      el.dispatchEvent(new Event(evts[i], { bubbles: true }));
    }
  }

  function fillField(selectors, val) {
    for (var i = 0; i < selectors.length; i++) {
      var el = d.querySelector(selectors[i]);
      if (el) {
        el.value = val;
        triggerEvents(el);
        return true;
      }
    }
    return false;
  }

  var ciList = [
    ["SpectrumPro 2.x - Laem Chabang - Accelink", "cf24ae13eb2196dc0ddcf4f1cad0cdcb"],
    ["SpectrumPro 2.x - Laem Chabang - Advanced Energy", "8034ee53eb2196dc0ddcf4f1cad0cddc"],
    ["SpectrumPro 2.x - Laem Chabang - All Customers", "4e7a806a1bc0f5dcbe48eca7624bcbda"],
    ["SpectrumPro 2.x - Laem Chabang - Center", "7c2a08e61bc0f5dcbe48eca7624bcb94"],
    ["SpectrumPro 2.x - Laem Chabang - Central (CTN/MSD)", "22ba35af932f96908f06bfc01bba1072"],
    ["SpectrumPro 2.x - Laem Chabang - Central (OBI/ABF)", "4076d75bc6604bdc4f765313a3b4fc45"],
    ["SpectrumPro 2.x - Laem Chabang - Ciena", "5ef2c71b1bc3659059fdedf3604bcb1f"],
    ["SpectrumPro 2.x - Laem Chabang - CruiseBay", "08be232b3b33d2d0ddfdd88c24e45a51"],
    ["SpectrumPro 2.x - Laem Chabang - Dellcom", "a6f2c71b1bc3659059fdedf3604bcb5d"],
    ["SpectrumPro 2.x - Laem Chabang - EMC", "aaf2c71b1bc3659059fdedf3604bcb62"],
    ["SpectrumPro 2.x - Laem Chabang - Ericson - Prod", "615d8accc807f6507e4c767dc0f5c441"],
    ["SpectrumPro 2.x - Laem Chabang - Meta", "76f2c71b1bc3659059fdedf3604bcba1"],
    ["SpectrumPro 2.x - Laem Chabang - Oracle", "cae940261bc0f5dcbe48eca7624bcb24"],
    ["SpectrumPro 2.x - Laem Chabang - Oracle CAMS", "82a5f70d1babe91c4d75a6c1604bcb17"],
    ["SpectrumPro 2.x - Laem Chabang - Ploycom Audio", "a2f2c71b1bc3659059fdedf3604bcb92"],
    ["SpectrumPro 2.x - Laem Chabang - Ploycom RMX", "36f2c71b1bc3659059fdedf3604bcb9c"],
    ["SpectrumPro 2.x - Laem Chabang - Ploycom Video", "e2f2c71b1bc3659059fdedf3604bcb97"],
    ["SpectrumPro 2.x - Laem Chabang - Polycom RMX", "a147575332a04bdca40707a4a56e65ba"],
    ["SpectrumPro 2.x - Laem Chabang - Polycom Video", "4f07939f9f604bdc676b7b97c0b278ba"],
    ["SpectrumPro 2.x - Laem Chabang - Spirent", "d2f2c71b1bc3659059fdedf3604bcb4e"],
    ["SpectrumPro 2.x - Laem Chabang - TDC", "0f9ef91d93efd290311db6cd1dba10d7"],
    ["SpectrumPro 2.x - Laem Chabang - Viavi", "47791a493bdd2e14ddfdd88c24e45aa4"],
    ["SpectrumPro 2.x - Laem Chabang - Vision", "abb61fdb42604bdcdfe897be34e9a968"]
  ];

  function clickUpdate() {
    setTimeout(function () {
      var updateBtn =
        d.getElementById("sysverb_update") ||
        d.querySelector('button[id="sysverb_update"], button[name="not_important"]');
      if (updateBtn) {
        updateBtn.click();
      } else if (f && typeof f.save === "function") {
        f.save();
      }
    }, 400);
  }

  function showModal(title, onConfirm) {
    var oldModal = d.getElementById("auto_bu_modal");
    if (oldModal) oldModal.remove();

    var modal = d.createElement("div");
    modal.id = "auto_bu_modal";
    modal.style =
      "position:fixed;top:15%;left:50%;transform:translateX(-50%);width:500px;max-width:92%;background:#fff;border:2px solid #2563eb;z-index:9999999;padding:22px;box-shadow:0 12px 36px rgba(0,0,0,0.4);border-radius:12px;font-family:sans-serif;box-sizing:border-box;";
    modal.innerHTML =
      '<h3 style="margin:0 0 12px 0;color:#2563eb;font-size:16px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">' +
      title +
      "</h3>" +
      '<label style="font-size:13px;color:#475569;font-weight:bold;">Select Configuration Item (BU):</label>' +
      '<select id="auto_bu_select" style="width:100%;padding:10px;margin:10px 0 20px 0;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;background:#f8fafc;outline:none;box-sizing:border-box;"></select>' +
      '<div style="text-align:right;">' +
      '<button id="auto_bu_cancel" style="padding:9px 18px;margin-right:8px;background:#e2e8f0;color:#334155;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">Cancel</button>' +
      '<button id="auto_bu_ok" style="padding:9px 22px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">Confirm & Update</button>' +
      "</div>";

    d.body.appendChild(modal);

    var sel = d.getElementById("auto_bu_select");
    for (var j = 0; j < ciList.length; j++) {
      var opt = d.createElement("option");
      opt.value = ciList[j][1];
      opt.text = ciList[j][0];
      sel.appendChild(opt);
    }

    d.getElementById("auto_bu_cancel").onclick = function () {
      modal.remove();
    };

    d.getElementById("auto_bu_ok").onclick = function () {
      var sysId = sel.value;
      var fullName = sel.options[sel.selectedIndex].text;
      modal.remove();
      onConfirm(sysId, fullName);
    };
  }

  var numVal = (d.querySelector('input[id*="number"],input[id*=".number"]') || {}).value || "";
  var curUrl = w.location.href;
  var isTask = numVal.indexOf("SCTASK") !== -1 || curUrl.indexOf("sc_task") !== -1;
  var isInc = numVal.indexOf("INC") !== -1 || curUrl.indexOf("incident") !== -1;

  if (isTask) {
    var aName = "Adoon Chueachai";
    if (f) {
      try {
        f.setValue("assigned_to", aName, aName);
      } catch (e) {}
    }
    var aDisp = d.querySelector(
      'input[id="sys_display.sc_task.assigned_to"],input[id*="display.assigned_to"]'
    );
    if (aDisp) {
      aDisp.value = aName;
      triggerEvents(aDisp);
    }

    showModal("⚡ JJ_Se: Catalog Task Setup", function (sysId, fullName) {
      if (f) {
        try {
          f.setValue("cmdb_ci", sysId, fullName);
        } catch (e) {}
      }
      var dispEl = d.querySelector(
        'input[id="sys_display.sc_task.cmdb_ci"],input[id*="display.cmdb_ci"]'
      );
      var rawEl = d.querySelector(
        'input[id="sc_task.cmdb_ci"],input[id*="cmdb_ci"]:not([id*="display"])'
      );
      if (dispEl) {
        dispEl.value = fullName;
        triggerEvents(dispEl);
      }
      if (rawEl) {
        rawEl.value = sysId;
        triggerEvents(rawEl);
      }
      clickUpdate();
    });
  } else if (isInc) {
    var aName = "Adoon Chueachai";
    showModal("⚡ JJ_In: Incident Setup", function (sysId, fullName) {
      var parts = fullName.split(" - ");
      var custName = parts[parts.length - 1].trim();

      if (f) {
        try {
          f.setValue("assigned_to", aName, aName);
        } catch (e) {}
        try {
          f.setValue("category", "application");
        } catch (e) {}
        try {
          f.setValue("business_application", "SpectrumPro", "SpectrumPro");
        } catch (e) {}
        try {
          f.setValue("u_business_application", "SpectrumPro", "SpectrumPro");
        } catch (e) {}
        try {
          f.setValue("cmdb_ci", sysId, fullName);
        } catch (e) {}
      }

      fillField(
        ['input[id="sys_display.incident.assigned_to"]', 'input[id*="display.assigned_to"]'],
        aName
      );
      var catSelect = d.querySelector('select[id="incident.category"]');
      if (catSelect) {
        catSelect.value = "application";
        triggerEvents(catSelect);
      }
      fillField(
        [
          'input[id="sys_display.incident.u_business_application"]',
          'input[id="sys_display.incident.business_application"]',
          'input
