(function () {
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

  /* 1. ส่งค่าเข้า g_form */
  if (f && typeof f.setValue === "function") {
    try {
      f.setValue("work_notes", noteText);
    } catch (e) {}
  }

  /* 2. กรอกลงใน Activity Stream Textarea */
  var textarea =
    d.getElementById("activity-stream-textarea") ||
    d.querySelector('textarea[data-stream-text-input="work_notes"]') ||
    d.querySelector('textarea[aria-label="Work notes"]');

  if (textarea) {
    textarea.value = noteText;
    textarea.focus();
    triggerEvents(textarea);

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

  /* 3. สั่งกดปุ่ม Update หรือ Post */
  setTimeout(function () {
    // วิธีที่ 1: เรียกคำสั่งบันทึก Form แบบสมบูรณ์ของ ServiceNow
    if (f && typeof f.getFormElement === "function" && typeof w.gsftSubmit === "function") {
      try {
        var formEl = f.getFormElement();
        if (formEl) {
          w.gsftSubmit(null, formEl, "sysverb_update");
          return;
        }
      } catch (e) {}
    }

    // วิธีที่ 2: กดปุ่ม Update ตรงๆ
    var updateBtn =
      d.getElementById("sysverb_update") ||
      d.querySelector('button[id="sysverb_update"], button[value="sysverb_update"]');

    if (updateBtn) {
      updateBtn.click();
      return;
    }

    // วิธีที่ 3: fallback ด้วย g_form.save()
    if (f && typeof f.save === "function") {
      f.save();
    }
  }, 300);
})();
