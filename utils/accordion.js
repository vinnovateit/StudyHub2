import $ from "jquery";

export default function jQueryAccordion() {
  var accordion = (function () {
    var $accordion = $(".js-accordion");
    var $accordion_header = $accordion.find(".js-accordion-header");
    var $accordion_item = $(".js-accordion-item");

    // default settings
    var settings = {
      // animation speed
      speed: 400,

      // close all other accordion items if true
      oneOpen: false,
    };

    return {
      // pass configurable object literal
      init: function ($settings) {
        $accordion_header.on("click", function () {
          accordion.toggle($(this));
        });

        $.extend(settings, $settings);

        // ensure only one accordion is active if oneOpen is true
        if (settings.oneOpen && $(".js-accordion-item.active").length > 1) {
          $(".js-accordion-item.active:not(:first)").removeClass("active");
        }

        // reveal the active accordion bodies
        $(".js-accordion-item.active").find("> .js-accordion-body").show();
      },
      toggle: function ($this) {
        if ($this[0] !== $.find(".active")[0]) {
          $(".active")
            .find(".js-accordion-header")
            .find(".fa-angle-up")
            .removeClass("fa-angle-up")
            .addClass("fa-angle-down");
        }
        if (
          settings.oneOpen &&
          $this[0] !=
            $this
              .closest(".js-accordion")
              .find("> .js-accordion-item.active > .js-accordion-header")[0]
        ) {
          $this
            .closest(".js-accordion")
            .find("> .js-accordion-item")
            .removeClass("active")
            .find(".js-accordion-body")
            .slideUp();
          $this
            .closest(".js-accordion-item")
            .find(".js-accordion-header")
            .find(".fa-angle-down")
            .removeClass("fa-angle-down")
            .addClass("fa-angle-up");
        }
        $this
          .closest(".active")
          .find(".js-accordion-header")
          .find(".fa-angle-up")
          .removeClass("fa-angle-up")
          .addClass("fa-angle-down");

        // show/hide the clicked accordion item
        $this.closest(".js-accordion-item").toggleClass("active");
        $this.next().stop().slideToggle(settings.speed);
      },
    };
  })();

  $(document).ready(function () {
    accordion.init({ speed: 300, oneOpen: true });
  });
}