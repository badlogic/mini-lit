import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { Select, type SelectGroup, type SelectOption } from "@mariozechner/mini-lit/dist/Select.js";
import { Separator } from "@mariozechner/mini-lit/dist/Separator.js";
import { Briefcase, Globe, MapPin, Palette, Phone, Settings, Star, User } from "lucide";

@customElement("page-selects")
export class SelectsPage extends LitElement {
   @state() basicValue = "";
   @state() sizeSmallValue = "";
   @state() sizeMediumValue = "";
   @state() sizeLargeValue = "";
   @state() variantDefaultValue = "";
   @state() variantOutlineValue = "";
   @state() variantGhostValue = "";
   @state() fitContentValue = "";
   @state() fixedWidthValue = "";
   @state() fullWidthValue = "";
   @state() countryValue = "";
   @state() priorityValue = "";
   @state() groupedValue = "";
   @state() interactiveValue = "";

   createRenderRoot() {
      return this;
   }

   private getBasicOptions(): SelectOption[] {
      return [
         { value: "option1", label: "Option 1" },
         { value: "option2", label: "Option 2" },
         { value: "option3", label: "Option 3" },
         { value: "option4", label: "Option 4 (Disabled)", disabled: true },
         { value: "option5", label: "Option 5" },
      ];
   }

   private getCountryOptions(): SelectOption[] {
      return [
         { value: "us", label: "United States", icon: "🇺🇸" },
         { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
         { value: "ca", label: "Canada", icon: "🇨🇦" },
         { value: "au", label: "Australia", icon: "🇦🇺" },
         { value: "de", label: "Germany", icon: "🇩🇪" },
         { value: "fr", label: "France", icon: "🇫🇷" },
         { value: "jp", label: "Japan", icon: "🇯🇵" },
         { value: "cn", label: "China (Disabled)", icon: "🇨🇳", disabled: true },
      ];
   }

   private getPriorityOptions(): SelectOption[] {
      return [
         {
            value: "low",
            label: "Low Priority",
            icon: html`<div class="w-3 h-3 rounded-full bg-green-500"></div>`,
         },
         {
            value: "medium",
            label: "Medium Priority",
            icon: html`<div class="w-3 h-3 rounded-full bg-yellow-500"></div>`,
         },
         {
            value: "high",
            label: "High Priority",
            icon: html`<div class="w-3 h-3 rounded-full bg-red-500"></div>`,
         },
         {
            value: "critical",
            label: "Critical Priority",
            icon: html`<div class="w-3 h-3 rounded-full bg-purple-500"></div>`,
         },
      ];
   }

   private getGroupedOptions(): SelectGroup[] {
      return [
         {
            label: "North America",
            options: [
               { value: "us", label: "United States", icon: "🇺🇸" },
               { value: "ca", label: "Canada", icon: "🇨🇦" },
               { value: "mx", label: "Mexico", icon: "🇲🇽" },
            ],
         },
         {
            label: "Europe",
            options: [
               { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
               { value: "de", label: "Germany", icon: "🇩🇪" },
               { value: "fr", label: "France", icon: "🇫🇷" },
               { value: "it", label: "Italy", icon: "🇮🇹" },
            ],
         },
         {
            label: "Asia",
            options: [
               { value: "jp", label: "Japan", icon: "🇯🇵" },
               { value: "cn", label: "China", icon: "🇨🇳" },
               { value: "kr", label: "South Korea", icon: "🇰🇷" },
            ],
         },
      ];
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Selects</h1>
               <p class="text-muted-foreground">
                  Dropdown select components for choosing from a list of options with various configurations.
               </p>
            </div>

            <!-- Basic Select -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Select</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="max-w-xs">
                           <label class="text-sm font-medium mb-2 block">Choose an option</label>
                           ${Select({
                              value: this.basicValue,
                              placeholder: "Select an option",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.basicValue = value;
                              },
                           })}
                        </div>
                        ${
                           this.basicValue
                              ? html`
                                <p class="text-sm text-muted-foreground">
                                   Selected: <code class="bg-muted px-1 py-0.5 rounded">${this.basicValue}</code>
                                </p>
                             `
                              : ""
                        }
                     </div>
                  `}
                  code=${`import { Select } from "@mariozechner/mini-lit";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4 (Disabled)", disabled: true },
  { value: "option5", label: "Option 5" }
];

\${Select({
  value: this.selectedValue,
  placeholder: "Select an option",
  options: options,
  onChange: (value) => {
    this.selectedValue = value;
  }
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Select Sizes -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Sizes</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Small</label>
                           ${Select({
                              size: "sm",
                              value: this.sizeSmallValue,
                              placeholder: "Small size...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.sizeSmallValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Medium (Default)</label>
                           ${Select({
                              size: "md",
                              value: this.sizeMediumValue,
                              placeholder: "Medium size...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.sizeMediumValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Large</label>
                           ${Select({
                              size: "lg",
                              value: this.sizeLargeValue,
                              placeholder: "Large size...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.sizeLargeValue = value;
                              },
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Select } from "@mariozechner/mini-lit";

// Small size
\${Select({
  size: "sm",
  value: this.value,
  placeholder: "Small size...",
  options: options,
  onChange: (value) => this.value = value
})}

// Medium size (default)
\${Select({
  size: "md",
  value: this.value,
  placeholder: "Medium size...",
  options: options,
  onChange: (value) => this.value = value
})}

// Large size
\${Select({
  size: "lg",
  value: this.value,
  placeholder: "Large size...",
  options: options,
  onChange: (value) => this.value = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Select Variants -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Variants</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Default</label>
                           ${Select({
                              variant: "default",
                              value: this.variantDefaultValue,
                              placeholder: "Default style...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.variantDefaultValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Outline</label>
                           ${Select({
                              variant: "outline",
                              value: this.variantOutlineValue,
                              placeholder: "Outline style...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.variantOutlineValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Ghost</label>
                           ${Select({
                              variant: "ghost",
                              value: this.variantGhostValue,
                              placeholder: "Ghost style...",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.variantGhostValue = value;
                              },
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Select } from "@mariozechner/mini-lit";

// Default variant
\${Select({
  variant: "default",
  value: this.value,
  placeholder: "Default style...",
  options: options,
  onChange: (value) => this.value = value
})}

// Outline variant
\${Select({
  variant: "outline",
  value: this.value,
  placeholder: "Outline style...",
  options: options,
  onChange: (value) => this.value = value
})}

// Ghost variant
\${Select({
  variant: "ghost",
  value: this.value,
  placeholder: "Ghost style...",
  options: options,
  onChange: (value) => this.value = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Width Options -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Width Options</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Fit Content Width</label>
                           ${Select({
                              fitContent: true,
                              value: this.fitContentValue,
                              placeholder: "Fits content",
                              options: [
                                 { value: "short", label: "Short" },
                                 { value: "medium", label: "Medium Option" },
                                 { value: "long", label: "This is a very long option name" },
                              ],
                              onChange: (value: string) => {
                                 this.fitContentValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Fixed Width (200px)</label>
                           ${Select({
                              width: "200px",
                              value: this.fixedWidthValue,
                              placeholder: "Fixed width",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.fixedWidthValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Full Width</label>
                           ${Select({
                              width: "100%",
                              value: this.fullWidthValue,
                              placeholder: "Full width select",
                              options: this.getBasicOptions(),
                              onChange: (value: string) => {
                                 this.fullWidthValue = value;
                              },
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Select } from "@mariozechner/mini-lit";

// Fit content width
\${Select({
  fitContent: true,
  value: this.value,
  placeholder: "Fits content",
  options: options,
  onChange: (value) => this.value = value
})}

// Fixed width
\${Select({
  width: "200px",
  value: this.value,
  placeholder: "Fixed width",
  options: options,
  onChange: (value) => this.value = value
})}

// Full width
\${Select({
  width: "100%",
  value: this.value,
  placeholder: "Full width",
  options: options,
  onChange: (value) => this.value = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           <label class="text-sm font-medium flex items-center gap-2">
                              ${icon(Globe, "sm")} Country
                           </label>
                           ${Select({
                              value: this.countryValue,
                              placeholder: "Select a country",
                              options: this.getCountryOptions(),
                              onChange: (value: string) => {
                                 this.countryValue = value;
                              },
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium flex items-center gap-2">
                              ${icon(Star, "sm")} Priority
                           </label>
                           ${Select({
                              value: this.priorityValue,
                              placeholder: "Select priority",
                              options: this.getPriorityOptions(),
                              onChange: (value: string) => {
                                 this.priorityValue = value;
                              },
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Select, icon } from "@mariozechner/mini-lit";
import { Globe } from "lucide";

const countryOptions = [
  { value: "us", label: "United States", icon: "🇺🇸" },
  { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
  { value: "ca", label: "Canada", icon: "🇨🇦" },
  // ... more countries
];

const priorityOptions = [
  {
    value: "low",
    label: "Low Priority",
    icon: html\`<div class="w-3 h-3 rounded-full bg-green-500"></div>\`
  },
  {
    value: "high",
    label: "High Priority",
    icon: html\`<div class="w-3 h-3 rounded-full bg-red-500"></div>\`
  }
];

\${Select({
  value: this.countryValue,
  placeholder: "Select a country",
  options: countryOptions,
  onChange: (value) => this.countryValue = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Grouped Options -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Grouped Options</h2>

               <preview-code
                  .preview=${html`
                     <div class="max-w-xs space-y-2">
                        <label class="text-sm font-medium flex items-center gap-2">
                           ${icon(MapPin, "sm")} Select Location
                        </label>
                        ${Select({
                           value: this.groupedValue,
                           placeholder: "Choose a location",
                           options: this.getGroupedOptions(),
                           onChange: (value: string) => {
                              this.groupedValue = value;
                           },
                        })}
                        ${
                           this.groupedValue
                              ? html`
                                <p class="text-sm text-muted-foreground">
                                   Selected: <code class="bg-muted px-1 py-0.5 rounded">${this.groupedValue}</code>
                                </p>
                             `
                              : ""
                        }
                     </div>
                  `}
                  code=${`import { Select, type SelectGroup } from "@mariozechner/mini-lit";

const groupedOptions: SelectGroup[] = [
  {
    label: "North America",
    options: [
      { value: "us", label: "United States", icon: "🇺🇸" },
      { value: "ca", label: "Canada", icon: "🇨🇦" },
      { value: "mx", label: "Mexico", icon: "🇲🇽" }
    ]
  },
  {
    label: "Europe",
    options: [
      { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
      { value: "de", label: "Germany", icon: "🇩🇪" },
      { value: "fr", label: "France", icon: "🇫🇷" }
    ]
  },
  {
    label: "Asia",
    options: [
      { value: "jp", label: "Japan", icon: "🇯🇵" },
      { value: "cn", label: "China", icon: "🇨🇳" },
      { value: "kr", label: "South Korea", icon: "🇰🇷" }
    ]
  }
];

\${Select({
  value: this.groupedValue,
  placeholder: "Choose a location",
  options: groupedOptions,
  onChange: (value) => this.groupedValue = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- States -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">States</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           <label class="text-sm font-medium">Normal</label>
                           ${Select({
                              value: "",
                              placeholder: "Normal select",
                              options: this.getBasicOptions(),
                              onChange: () => {},
                           })}
                        </div>
                        <div class="space-y-2">
                           <label class="text-sm font-medium text-muted-foreground">Disabled</label>
                           ${Select({
                              value: "",
                              placeholder: "Disabled select",
                              options: this.getBasicOptions(),
                              disabled: true,
                              onChange: () => {},
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Select } from "@mariozechner/mini-lit";

// Normal state
\${Select({
  value: this.value,
  placeholder: "Normal select",
  options: options,
  onChange: (value) => this.value = value
})}

// Disabled state
\${Select({
  value: this.value,
  placeholder: "Disabled select",
  options: options,
  disabled: true,
  onChange: (value) => this.value = value
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Example</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div class="space-y-2">
                              <label class="text-sm font-medium flex items-center gap-2">
                                 ${icon(User, "sm")} Department
                              </label>
                              ${Select({
                                 value: this.interactiveValue,
                                 placeholder: "Select department",
                                 options: [
                                    { value: "eng", label: "Engineering", icon: html`${icon(Settings, "xs")}` },
                                    { value: "design", label: "Design", icon: html`${icon(Palette, "xs")}` },
                                    { value: "sales", label: "Sales", icon: html`${icon(Phone, "xs")}` },
                                    { value: "hr", label: "Human Resources", icon: html`${icon(User, "xs")}` },
                                    { value: "finance", label: "Finance", icon: html`${icon(Briefcase, "xs")}` },
                                 ],
                                 onChange: (value: string) => {
                                    this.interactiveValue = value;
                                 },
                              })}
                           </div>

                           ${
                              this.interactiveValue
                                 ? html`
                                   <div class="p-4 border border-border rounded-lg bg-muted/30">
                                      <h4 class="text-sm font-medium mb-2">Selection Details:</h4>
                                      <div class="space-y-1 text-sm">
                                         <p>
                                            Department Code:
                                            <code class="bg-background px-1 rounded">${this.interactiveValue}</code>
                                         </p>
                                         <p>
                                            Department:
                                            <span class="font-medium">
                                               ${
                                                  this.interactiveValue === "eng"
                                                     ? "Engineering"
                                                     : this.interactiveValue === "design"
                                                       ? "Design"
                                                       : this.interactiveValue === "sales"
                                                         ? "Sales"
                                                         : this.interactiveValue === "hr"
                                                           ? "Human Resources"
                                                           : "Finance"
                                               }
                                            </span>
                                         </p>
                                      </div>
                                   </div>
                                `
                                 : html`
                                   <div class="p-4 border border-dashed border-border rounded-lg">
                                      <p class="text-sm text-muted-foreground">Select a department to see details</p>
                                   </div>
                                `
                           }
                        </div>
                     </div>
                  `}
                  code=${`import { Select, icon } from "@mariozechner/mini-lit";
import { User, Settings, Palette, Phone, Briefcase } from "lucide";

@state() selectedDepartment = "";

const departmentOptions = [
  { value: "eng", label: "Engineering", icon: html\`\${icon(Settings, "xs")}\` },
  { value: "design", label: "Design", icon: html\`\${icon(Palette, "xs")}\` },
  { value: "sales", label: "Sales", icon: html\`\${icon(Phone, "xs")}\` },
  { value: "hr", label: "Human Resources", icon: html\`\${icon(User, "xs")}\` },
  { value: "finance", label: "Finance", icon: html\`\${icon(Briefcase, "xs")}\` }
];

\${Select({
  value: this.selectedDepartment,
  placeholder: "Select department",
  options: departmentOptions,
  onChange: (value) => {
    this.selectedDepartment = value;
  }
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Select Properties</h3>
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                           <thead>
                              <tr class="border-b border-border">
                                 <th class="text-left py-2 pr-4">Property</th>
                                 <th class="text-left py-2 pr-4">Type</th>
                                 <th class="text-left py-2 pr-4">Default</th>
                                 <th class="text-left py-2">Description</th>
                              </tr>
                           </thead>
                           <tbody class="font-mono">
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">value</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Currently selected value</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">placeholder</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"Select an option"</td>
                                 <td class="py-2 font-sans">Placeholder text when no value is selected</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">options</td>
                                 <td class="py-2 pr-4 text-muted-foreground">SelectOption[] | SelectGroup[]</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Array of options or grouped options</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onChange</td>
                                 <td class="py-2 pr-4 text-muted-foreground">(value: string) => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Callback when selection changes</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">disabled</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Disables the select when true</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">size</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm" | "md" | "lg"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"md"</td>
                                 <td class="py-2 font-sans">Size of the select</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">variant</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"default" | "ghost" | "outline"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"default"</td>
                                 <td class="py-2 font-sans">Visual style variant</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">width</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"180px"</td>
                                 <td class="py-2 font-sans">Width of the select</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">fitContent</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Adjust width to fit content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">className</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Additional CSS classes</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">SelectOption Interface</h3>
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                           <thead>
                              <tr class="border-b border-border">
                                 <th class="text-left py-2 pr-4">Property</th>
                                 <th class="text-left py-2 pr-4">Type</th>
                                 <th class="text-left py-2 pr-4">Required</th>
                                 <th class="text-left py-2">Description</th>
                              </tr>
                           </thead>
                           <tbody class="font-mono">
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">value</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">yes</td>
                                 <td class="py-2 font-sans">Option value</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">label</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">yes</td>
                                 <td class="py-2 font-sans">Display label</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">icon</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">no</td>
                                 <td class="py-2 font-sans">Optional icon</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">disabled</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">no</td>
                                 <td class="py-2 font-sans">Disable this option</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">SelectGroup Interface</h3>
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                           <thead>
                              <tr class="border-b border-border">
                                 <th class="text-left py-2 pr-4">Property</th>
                                 <th class="text-left py-2 pr-4">Type</th>
                                 <th class="text-left py-2 pr-4">Required</th>
                                 <th class="text-left py-2">Description</th>
                              </tr>
                           </thead>
                           <tbody class="font-mono">
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">label</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">no</td>
                                 <td class="py-2 font-sans">Group label</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">options</td>
                                 <td class="py-2 pr-4 text-muted-foreground">SelectOption[]</td>
                                 <td class="py-2 pr-4 text-muted-foreground">yes</td>
                                 <td class="py-2 font-sans">Options in this group</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}
