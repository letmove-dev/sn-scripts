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

  /* 1. ใส่ข้อความผ่าน g_form มาตรฐานของ ServiceNow */
  if (f && typeof f.setValue === "function") {
    try {
      f.setValue("work_notes", noteText);
    } catch (e) {}
  }

  /* 2. จัดการช่อง Activity Stream (AngularJS) */
  var textarea =
    d.getElementById("activity-stream-textarea") ||
    d.querySelector('textarea[data-stream-text-input="work_notes"]') ||
    d.querySelector('textarea[aria-label="Work notes"]');

  if (textarea) {
    textarea.value = noteText;
    textarea.focus();
    triggerEvents(textarea);

    /* อัปเดต Scope ของ Angular เพื่อให้ค่าถูกผูกกับโมเดลสมบูรณ์ */
    if (w.angular) {
      try {
        var scope = w.angular.element(textarea).scope();
        if (scope) {
          scope.inputTypeValue = noteText;
          scope.$apply();
        }
      } catch (err) {}
    }
  }

  /* 3. สั่งกดปุ่ม Update ของหน้าเว็บอัตโนมัติ */
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
})();
