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

  /* 1. ใส่ผ่าน g_form มาตรฐานของ ServiceNow */
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

    /* อัปเดต Scope ของ Angular เพื่อให้ปุ่ม Post ทำงานได้ */
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

  /* เลื่อนหน้าจอลงมาโฟกัสที่ช่อง Work notes */
  if (textarea) {
    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
