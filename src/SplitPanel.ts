import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, type Ref, ref } from "lit/directives/ref.js";
import { i18n } from "./i18n.js";

@customElement("split-panel")
export class SplitPanel extends LitElement {
   @property({ type: Object }) leftPanel?: TemplateResult | HTMLElement;
   @property({ type: Object }) rightPanel?: TemplateResult | HTMLElement;
   @property({ type: Object }) topPanel?: TemplateResult | HTMLElement;
   @property({ type: Object }) bottomPanel?: TemplateResult | HTMLElement;
   @property() initialSplit = 50; // percentage for left/top panel
   @property() minSize = 200; // minimum size in pixels for each panel
   @property() hideRight = false; // controls visibility of right panel
   @property() hideBottom = false; // controls visibility of bottom panel
   @property() mobileBreakpoint = 1024; // px, below this is mobile mode
   @property({ type: Boolean }) vertical = false; // vertical split mode

   @state() private currentSplit = 50;
   @state() private isMobile = false;

   private containerRef: Ref<HTMLDivElement> = createRef();
   private firstPanelRef: Ref<HTMLDivElement> = createRef();
   private secondPanelRef: Ref<HTMLDivElement> = createRef();
   private dividerRef: Ref<HTMLDivElement> = createRef();

   private isDragging = false;
   private startPos = 0;
   private startSplit = 50;

   protected override createRenderRoot(): HTMLElement | DocumentFragment {
      return this; // light DOM
   }

   override connectedCallback() {
      super.connectedCallback();
      this.currentSplit = this.initialSplit;
      this.checkMobile();
      window.addEventListener("resize", this.handleResize);
   }

   override disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener("resize", this.handleResize);
   }

   private handleResize = () => {
      this.checkMobile();
   };

   private checkMobile() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < this.mobileBreakpoint;
      if (wasMobile !== this.isMobile) {
         this.requestUpdate();
      }
   }

   private handleMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.startPos = this.vertical ? e.clientY : e.clientX;
      const container = this.containerRef.value;
      if (container) {
         const rect = container.getBoundingClientRect();
         if (this.vertical) {
            const currentTop = this.firstPanelRef.value?.offsetHeight || 0;
            this.startSplit = (currentTop / rect.height) * 100;
         } else {
            const currentLeft = this.firstPanelRef.value?.offsetWidth || 0;
            this.startSplit = (currentLeft / rect.width) * 100;
         }
      }

      document.body.style.userSelect = "none";
      document.body.style.cursor = this.vertical ? "row-resize" : "col-resize";

      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);

      e.preventDefault();
   };

   private handleMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;

      const container = this.containerRef.value;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      if (this.vertical) {
         const deltaY = e.clientY - this.startPos;
         const deltaPercent = (deltaY / rect.height) * 100;
         let newSplit = this.startSplit + deltaPercent;

         // Apply constraints
         const minPercent = (this.minSize / rect.height) * 100;
         const maxPercent = 100 - minPercent;
         newSplit = Math.max(minPercent, Math.min(maxPercent, newSplit));

         // Update panel sizes directly
         if (this.firstPanelRef.value && this.secondPanelRef.value) {
            this.firstPanelRef.value.style.height = `${newSplit}%`;
            this.secondPanelRef.value.style.height = `${100 - newSplit}%`;
            this.currentSplit = newSplit;
         }
      } else {
         const deltaX = e.clientX - this.startPos;
         const deltaPercent = (deltaX / rect.width) * 100;
         let newSplit = this.startSplit + deltaPercent;

         // Apply constraints
         const minPercent = (this.minSize / rect.width) * 100;
         const maxPercent = 100 - minPercent;
         newSplit = Math.max(minPercent, Math.min(maxPercent, newSplit));

         // Update panel sizes directly
         if (this.firstPanelRef.value && this.secondPanelRef.value) {
            this.firstPanelRef.value.style.width = `${newSplit}%`;
            this.secondPanelRef.value.style.width = `${100 - newSplit}%`;
            this.currentSplit = newSplit;
         }
      }
   };

   private handleMouseUp = () => {
      this.isDragging = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
   };

   // Touch support
   private handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
         clientX: touch.clientX,
         clientY: touch.clientY,
         button: 0,
      });
      this.handleMouseDown(mouseEvent);
   };

   private handleTouchMove = (e: TouchEvent) => {
      if (!this.isDragging) return;

      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
         clientX: touch.clientX,
         clientY: touch.clientY,
      });
      this.handleMouseMove(mouseEvent);
      e.preventDefault();
   };

   private handleTouchEnd = () => {
      this.handleMouseUp();
   };

   override render() {
      // Vertical mode
      if (this.vertical) {
         const panel1 = this.topPanel || this.leftPanel;
         const panel2 = this.bottomPanel || this.rightPanel;
         const hideSecond = this.hideBottom || this.hideRight;

         if (!panel1 || !panel2) {
            return html`<div>${i18n("Loading...")}</div>`;
         }

         return html`
            <div class="flex flex-col h-full w-full relative" ${ref(this.containerRef)}>
               <!-- Top Panel -->
               <div
                  class="w-full overflow-hidden"
                  style="height: ${hideSecond ? "100%" : this.currentSplit + "%"}"
                  ${ref(this.firstPanelRef)}
               >
                  ${panel1}
               </div>

               <!-- Horizontal Divider -->
               <div
                  class="h-1 bg-border hover:bg-accent cursor-row-resize relative flex-shrink-0
						       before:content-[''] before:absolute before:inset-x-0 before:-top-2 before:-bottom-2 before:h-5
						       md:before:-top-1 md:before:-bottom-1 md:before:h-3 ${hideSecond ? "hidden" : ""}"
                  @mousedown=${this.handleMouseDown}
                  @touchstart=${this.handleTouchStart}
                  @touchmove=${this.handleTouchMove}
                  @touchend=${this.handleTouchEnd}
                  ${ref(this.dividerRef)}
               >
                  <!-- Grab handle indicator -->
                  <div
                     class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-8 bg-muted-foreground/30 rounded-full"
                  ></div>
               </div>

               <!-- Bottom Panel -->
               <div
                  class="w-full overflow-hidden ${hideSecond ? "hidden" : ""}"
                  style="height: ${100 - this.currentSplit}%"
                  ${ref(this.secondPanelRef)}
               >
                  ${panel2}
               </div>
            </div>
         `;
      }

      // Horizontal mode (default)
      if (!this.leftPanel || !this.rightPanel) {
         return html`<div>${i18n("Loading...")}</div>`;
      }

      return html`
         <div class="flex h-full w-full relative" ${ref(this.containerRef)}>
            <!-- Left Panel -->
            <div
               class="h-full overflow-hidden"
               style="width: ${this.hideRight ? "100%" : this.currentSplit + "%"}"
               ${ref(this.firstPanelRef)}
            >
               ${this.leftPanel}
            </div>

            <!-- Vertical Divider -->
            <div
               class="w-1 bg-border hover:bg-accent cursor-col-resize relative flex-shrink-0
					       before:content-[''] before:absolute before:inset-y-0 before:-left-2 before:-right-2 before:w-5
					       md:before:-left-1 md:before:-right-1 md:before:w-3 ${this.hideRight ? "hidden" : ""}"
               @mousedown=${this.handleMouseDown}
               @touchstart=${this.handleTouchStart}
               @touchmove=${this.handleTouchMove}
               @touchend=${this.handleTouchEnd}
               ${ref(this.dividerRef)}
            >
               <!-- Grab handle indicator -->
               <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-muted-foreground/30 rounded-full"
               ></div>
            </div>

            <!-- Right Panel -->
            <div
               class="h-full overflow-hidden ${this.hideRight ? "hidden" : ""}"
               style="width: ${100 - this.currentSplit}%"
               ${ref(this.secondPanelRef)}
            >
               ${this.rightPanel}
            </div>
         </div>
      `;
   }
}

declare global {
   interface HTMLElementTagNameMap {
      "split-panel": SplitPanel;
   }
}
