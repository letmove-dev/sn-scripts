(function () {
  var w = document.getElementById("gsft_main")
    ? document.getElementById("gsft_main").contentWindow
    : window;
  var d = w.document;
  var f = w.g_form;

  function triggerEvents(el) {
    if (!el) return;
    ["input", "change"].forEach(function (evt) {
      el.dispatchEvent(new Event(evt, { bubbles: true }));
    });
  }

  function setFieldValue(id, val) {
    var el = d.getElementById(id) || d.querySelector('[name="' + id + '"]');
    if (el) {
      el.value = val;
      triggerEvents(el);
      return true;
    }
    return false;
  }

  /* ฟังก์ชันเซ็ต Reference โดยตรงอย่างปลอดภัย ไม่ทำให้เกิด Match not found */
  function applyReference(fieldName, sysId, displayName) {
    displayName = displayName || sysId;
    if (f && typeof f.setValue === "function") {
      try {
        f.setValue(fieldName, sysId, displayName);
      } catch (e) {}
    }
    var disp = d.getElementById("sys_display." + fieldName) || d.querySelector('input[name="sys_display.' + fieldName + '"]');
    if (disp) {
      disp.value = displayName;
    }
    var raw = d.getElementById(fieldName) || d.querySelector('input[name="' + fieldName + '"]:not([id*="sys_display"])');
    if (raw) {
      raw.value = sysId;
    }

    var wrapper = d.getElementById("element." + fieldName);
    if (wrapper) {
      wrapper.classList.remove("has-error");
      var err = wrapper.querySelector(".help-block, .field-alert");
      if (err) err.style.display = "none";
    }
  }

  var ciList = [
    ["SpectrumPro 2.x - Laem Chabang - Google": "62f2c71b1bc3659059fdedf3604bcb8d"],
["SpectrumPro 2.x - Laem Chabang - Meta": "76f2c71b1bc3659059fdedf3604bcba1"],
["SpectrumPro 2.x - Laem Chabang - Kapok": "22f2c71b1bc3659059fdedf3604bcb88"],
["SpectrumPro 2.x - Laem Chabang - CruiseBay": "08be232b3b33d2d0ddfdd88c24e45a51"],
["SpectrumPro 2.x - Laem Chabang - Ciena": "5ef2c71b1bc3659059fdedf3604bcb1f"],
["SpectrumPro 2.x - Laem Chabang - JDM 1j": "6ef2c71b1bc3659059fdedf3604bcb71"],
["SpectrumPro 2.x - Laem Chabang - JDM DC": "aef2c71b1bc3659059fdedf3604bcb76"],
["SpectrumPro 2.x - Laem Chabang - All Customers": "4e7a806a1bc0f5dcbe48eca7624bcbda"],
["SpectrumPro 2.x - Laem Chabang - Center": "7c2a08e61bc0f5dcbe48eca7624bcb94"],
["SpectrumPro 2.x - Laem Chabang - Central (CTN/MSD)": "22ba35af932f96908f06bfc01bba1072"],
["SpectrumPro 2.x - Laem Chabang - Central (OBI/ABF)": "4076d75bc6604bdc4f765313a3b4fc45"],
["SpectrumPro 2.x - Laem Chabang - Dellcom": "a6f2c71b1bc3659059fdedf3604bcb5d"],
["SpectrumPro 2.x - Laem Chabang - EMC": "aaf2c71b1bc3659059fdedf3604bcb62"],  
["SpectrumPro 2.x - Laem Chabang - KeySight": "3aa1c8345b1f8bd8f6923cb70979d172"],  
["SpectrumPro 2.x - Laem Chabang - Spirent": "d2f2c71b1bc3659059fdedf3604bcb4e"],
["SpectrumPro 2.x - Laem Chabang - TDC": "0f9ef91d93efd290311db6cd1dba10d7"],
["SpectrumPro 2.x - Laem Chabang - Viavi": "47791a493bdd2e14ddfdd88c24e45aa4"],
["SpectrumPro 2.x - Laem Chabang - Vision": "abb61fdb42604bdcdfe897be34e9a968"]
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
    }, 1200);
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

  /* เช็คตัวตนคนที่กำลังล็อกอินอยู่หน้านั้นแบบอัตโนมัติ */
  var userObj = w.g_user || (window.top && window.top.g_user) || {};
  var currentUserId = userObj.userID || "";
  var currentDisplayName = (userObj.firstName && userObj.lastName)
    ? (userObj.firstName + " " + userObj.lastName).trim()
    : (userObj.name || "Adoon Chueachai");

  var spectrumProSysId = "2b53198edbef1850aabaaab35b96199f";

  if (isTask) {
    applyReference("assigned_to", currentUserId, currentDisplayName);
    applyReference("sc_task.assigned_to", currentUserId, currentDisplayName);

    showModal("⚡ JJ_Se: Catalog Task Setup", function (sysId, fullName) {
      applyReference("cmdb_ci", sysId, fullName);
      applyReference("sc_task.cmdb_ci", sysId, fullName);
      clickUpdate();
    });
  } else if (isInc) {
    showModal("⚡ JJ_In: Incident Setup", function (sysId, fullName) {
      var parts = fullName.split(" - ");
      var custName = parts[parts.length - 1].trim();

      /* 1. Category */
      if (f) {
        try { f.setValue("category", "application"); } catch (e) {}
      }
      var catSelect = d.getElementById("incident.category") || d.querySelector('select[name="incident.category"]');
      if (catSelect) {
        catSelect.value = "application";
        triggerEvents(catSelect);
      }

      /* 2. Current Assigned to ดึงชื่อคนที่กดปุ่มอัตโนมัติ */
      applyReference("assigned_to", currentUserId, currentDisplayName);
      applyReference("incident.assigned_to", currentUserId, currentDisplayName);

      /* 3. Business Application */
      applyReference("u_business_application", spectrumProSysId, "SpectrumPro");
      applyReference("incident.u_business_application", spectrumProSysId, "SpectrumPro");

      /* 4. Customer & HealthTech */
      var htContainer = d.getElementById("element.incident.u_healthtech_customer_scope");
      if (htContainer) {
        htContainer.style.display = "";
        htContainer.classList.remove("hidden");
      }
      var custContainer = d.getElementById("element.incident.u_customer");
      if (custContainer) {
        custContainer.style.display = "";
        custContainer.classList.remove("hidden");
      }
      if (f) {
        try { f.setDisplay("u_healthtech_customer_scope", true); } catch (e) {}
        try { f.setValue("u_healthtech_customer_scope", "no"); } catch (e) {}
        try { f.setDisplay("u_customer", true); } catch (e) {}
        try { f.setValue("u_customer", custName); } catch (e) {}
      }
      var htSelect = d.querySelector('select[id="incident.u_healthtech_customer_scope"], select[id*="healthtech"]');
      if (htSelect) {
        for (var k = 0; k < htSelect.options.length; k++) {
          var v = htSelect.options[k].value.toLowerCase();
          var t = htSelect.options[k].text.trim().toLowerCase();
          if (v === "no" || t === "no") {
            htSelect.selectedIndex = k;
            triggerEvents(htSelect);
            break;
          }
        }
      }
      setFieldValue("incident.u_customer", custName);
      var custDisp = d.getElementById("sys_display.incident.u_customer");
      if (custDisp) {
        custDisp.value = custName;
      }

      /* 5. Configuration Item หน่วงเวลา 500ms ป้องกันการชนกับ Business App */
      setTimeout(function () {
        applyReference("cmdb_ci", sysId, fullName);
        applyReference("incident.cmdb_ci", sysId, fullName);
      }, 500);

      /* 6. กด Update อัตโนมัติ */
      clickUpdate();
    });
  } else {
    alert("ไม่พบหน้าจอ SCTASK หรือ Incident ครับ");
  }
})();
