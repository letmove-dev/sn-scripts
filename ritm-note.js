(function () {
  /* หา Window และ Document ที่ถูกต้อง ไม่ว่าจะอยู่ใน Frame ใด */
  var w = document.getElementById("gsft_main")
    ? document.getElementById("gsft_main").contentWindow
    : window;
  var d = w.document;
  var f = w.g_form;

  var noteText = "After manager Approve Please assign to me";

  function triggerEvents(el) {
    if (!el) return;
    ["input", "change", "keydown", "keyup", "blur"].forEach(function (evt) {
      el.dispatchEvent(new Event(evt, { bubbles: true }));
    });
  }

  /* 1. ใส่ค่าผ่าน g_form ของ ServiceNow */
  if (f && typeof f.setValue === "function") {
    try {
      f.setValue("work_notes", noteText);
    } catch (e) {}
  }

  /* 2. เซ็ตค่าลงใน DOM ของ Activity Stream (AngularJS) */
  var textarea =
    d.getElementById("activity-stream-textarea") ||
    d.querySelector('textarea[data-stream-text-input="work_notes"]') ||
    d.querySelector('textarea[aria-label="Work notes"]');

  if (textarea) {
    textarea.value = noteText;
    textarea.focus();
    triggerEvents(textarea);

    /* เชื่อมเข้ากับโมเดลของ AngularJS เพื่อให้ระบบตรวจจับข้อความ */
    if (w.angular) {
      try {
        var scope = w.angular.element(textarea).scope();
        if (scope) {
          scope.inputTypeValue = noteText;
          if (!scope.$$phase) scope.$apply();
        }
      } catch (err) {}
    }
  }

  /* 3. เซ็ตค่าลงใน hidden input พื้นฐานของ Form */
  var hiddenInputs = d.querySelectorAll('input[id*="work_notes"], textarea[id*="work_notes"]');
  hiddenInputs.forEach(function (el) {
    if (el.id !== "activity-stream-textarea") {
      el.value = noteText;
      triggerEvents(el);
    }
  });

  /* 4. สั่ง Submit บันทึก Form โดยใช้ gsftSubmit แท้ของ ServiceNow */
  setTimeout(function () {
    /* ค้นหาปุ่ม Update ทั้งใน Iframe และนอก Iframe */
    var updateBtn =
      d.getElementById("sysverb_update") ||
      d.querySelector('button[id="sysverb_update"]') ||
      document.getElementById("sysverb_update") ||
      document.querySelector('button[id="sysverb_update"]');

    if (w.gsftSubmit && updateBtn) {
      /* เรียกคำสั่งตรงตาม onclick="return gsftSubmit(this);" */
      try {
        w.gsftSubmit(updateBtn);
        return;
      } catch (e) {}
    }

    if (updateBtn) {
      updateBtn.click();
    } else if (f && typeof f.save === "function") {
      f.save();
    }
  }, 400);
})();
