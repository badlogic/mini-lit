import { Badge } from "@mariozechner/mini-lit/dist/Badge.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@mariozechner/mini-lit/dist/Card.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { Separator } from "@mariozechner/mini-lit/dist/Separator.js";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import {
   Activity,
   Bell,
   Calendar,
   CreditCard,
   Heart,
   MapPin,
   MessageCircle,
   Settings,
   Share,
   Shield,
   Star,
   User,
} from "lucide";

@customElement("page-cards")
export class CardsPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Cards</h1>
               <p class="text-muted-foreground">
                  Flexible content containers with headers, content, and footer sections.
               </p>
            </div>

            <!-- Basic Cards -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Cards</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Card({
                           children: html`
                              ${CardContent({
                                 children: html`
                                    <p>
                                       This is a simple card with just content. Perfect for basic information display.
                                    </p>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: CardTitle({ children: "Card Title" }),
                              })}
                              ${CardContent({
                                 children: html`
                                    <p>
                                       This card has a header with a title. Great for organizing content with clear
                                       headings.
                                    </p>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    ${CardTitle({ children: "Card with Description" })}
                                    ${CardDescription({ children: "This is a subtitle or description" })}
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <p>This card includes both a title and description in the header section.</p>
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Simple card with content only
\${Card({
  children: html\`
    \${CardContent({
      children: html\`<p>Simple card content</p>\`
    })}
  \`
})}

// Card with header and title
\${Card({
  children: html\`
    \${CardHeader({
      children: CardTitle({ children: "Card Title" })
    })}
    \${CardContent({
      children: html\`<p>Card content here</p>\`
    })}
  \`
})}

// Card with title and description
\${Card({
  children: html\`
    \${CardHeader({
      children: html\`
        \${CardTitle({ children: "Title" })}
        \${CardDescription({ children: "Description" })}
      \`
    })}
    \${CardContent({
      children: html\`<p>Content</p>\`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Cards with Footers -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Cards with Footers</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    ${CardTitle({ children: "Settings Panel" })}
                                    ${CardDescription({ children: "Manage your account preferences" })}
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <div class="space-y-3">
                                       <div class="flex items-center justify-between">
                                          <span>Email notifications</span>
                                          ${Badge({ variant: "secondary", children: "Enabled" })}
                                       </div>
                                       <div class="flex items-center justify-between">
                                          <span>Two-factor authentication</span>
                                          ${Badge({ variant: "destructive", children: "Disabled" })}
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardFooter({
                                 children: html`
                                    <div class="flex gap-2">
                                       ${Button({ variant: "outline", children: "Cancel" })}
                                       ${Button({ children: "Save Changes" })}
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    ${CardTitle({ children: "Article Preview" })}
                                    ${CardDescription({ children: "Published 2 hours ago" })}
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <p class="text-sm">
                                       This is a preview of an article. The content can be quite long and the card will
                                       adapt to fit the content appropriately.
                                    </p>
                                 `,
                              })}
                              ${CardFooter({
                                 children: html`
                                    <div class="flex items-center justify-between w-full">
                                       <div class="flex gap-2">
                                          ${Button({
                                             variant: "ghost",
                                             size: "sm",
                                             children: html`${icon(Heart, "sm")} 24`,
                                          })}
                                          ${Button({
                                             variant: "ghost",
                                             size: "sm",
                                             children: html`${icon(MessageCircle, "sm")} 8`,
                                          })}
                                          ${Button({
                                             variant: "ghost",
                                             size: "sm",
                                             children: html`${icon(Share, "sm")} Share`,
                                          })}
                                       </div>
                                       ${Button({ variant: "outline", size: "sm", children: "Read More" })}
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Card with footer actions
\${Card({
  children: html\`
    \${CardHeader({
      children: html\`
        \${CardTitle({ children: "Settings Panel" })}
        \${CardDescription({ children: "Manage your account preferences" })}
      \`
    })}
    \${CardContent({
      children: html\`
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span>Email notifications</span>
            \${Badge({ variant: "secondary", children: "Enabled" })}
          </div>
        </div>
      \`
    })}
    \${CardFooter({
      children: html\`
        <div class="flex gap-2">
          \${Button({ variant: "outline", children: "Cancel" })}
          \${Button({ children: "Save Changes" })}
        </div>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Cards -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Cards</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${Card({
                           className: "cursor-pointer hover:shadow-lg transition-shadow",
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(User, "md")} ${CardTitle({ children: "Profile" })}
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <p class="text-sm text-muted-foreground">View and edit your profile information</p>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           className: "cursor-pointer hover:shadow-lg transition-shadow",
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(Bell, "md")} ${CardTitle({ children: "Notifications" })}
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <div class="flex items-center justify-between">
                                       <p class="text-sm text-muted-foreground">3 new notifications</p>
                                       ${Badge({ variant: "destructive", children: "3" })}
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           className: "cursor-pointer hover:shadow-lg transition-shadow",
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(Settings, "md")} ${CardTitle({ children: "Settings" })}
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <p class="text-sm text-muted-foreground">Configure your preferences</p>
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Interactive card with hover effect
\${Card({
  className: "cursor-pointer hover:shadow-lg transition-shadow",
  children: html\`
    \${CardHeader({
      children: html\`
        <div class="flex items-center gap-3">
          \${icon(User, "md")}
          \${CardTitle({ children: "Profile" })}
        </div>
      \`
    })}
    \${CardContent({
      children: html\`
        <p class="text-sm text-muted-foreground">
          View and edit your profile information
        </p>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Feature Cards -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Feature Cards</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(Shield, "lg")}
                                       <div>
                                          ${CardTitle({ children: "Security" })}
                                          ${CardDescription({ children: "Enterprise-grade protection" })}
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <ul class="text-sm space-y-1">
                                       <li>• End-to-end encryption</li>
                                       <li>• Multi-factor authentication</li>
                                       <li>• Regular security audits</li>
                                    </ul>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(Activity, "lg")}
                                       <div>
                                          ${CardTitle({ children: "Analytics" })}
                                          ${CardDescription({ children: "Real-time insights" })}
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <ul class="text-sm space-y-1">
                                       <li>• Live dashboard</li>
                                       <li>• Custom reports</li>
                                       <li>• Data visualization</li>
                                    </ul>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-center gap-3">
                                       ${icon(CreditCard, "lg")}
                                       <div>
                                          ${CardTitle({ children: "Billing" })}
                                          ${CardDescription({ children: "Flexible pricing" })}
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <ul class="text-sm space-y-1">
                                       <li>• Pay as you scale</li>
                                       <li>• No hidden fees</li>
                                       <li>• Cancel anytime</li>
                                    </ul>
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Feature card with icon and list
\${Card({
  children: html\`
    \${CardHeader({
      children: html\`
        <div class="flex items-center gap-3">
          \${icon(Shield, "lg")}
          <div>
            \${CardTitle({ children: "Security" })}
            \${CardDescription({ children: "Enterprise-grade protection" })}
          </div>
        </div>
      \`
    })}
    \${CardContent({
      children: html\`
        <ul class="text-sm space-y-1">
          <li>• End-to-end encryption</li>
          <li>• Multi-factor authentication</li>
          <li>• Regular security audits</li>
        </ul>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Complex Layouts -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Complex Layouts</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    <div class="flex items-start justify-between">
                                       <div>
                                          ${CardTitle({ children: "Tech Conference 2024" })}
                                          ${CardDescription({ children: "Annual technology summit" })}
                                       </div>
                                       ${Badge({ children: "Upcoming" })}
                                    </div>
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <div class="space-y-3">
                                       <div class="flex items-center gap-2 text-sm">
                                          ${icon(Calendar, "sm")}
                                          <span>March 15-17, 2024</span>
                                       </div>
                                       <div class="flex items-center gap-2 text-sm">
                                          ${icon(MapPin, "sm")}
                                          <span>San Francisco, CA</span>
                                       </div>
                                       ${Separator()}
                                       <div class="flex items-center justify-between">
                                          <span class="text-sm font-medium">Attendees</span>
                                          <span class="text-sm text-muted-foreground">1,247 registered</span>
                                       </div>
                                       <div class="flex items-center justify-between">
                                          <span class="text-sm font-medium">Speakers</span>
                                          <span class="text-sm text-muted-foreground">24 confirmed</span>
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardFooter({
                                 children: html`
                                    <div class="flex gap-2 w-full">
                                       ${Button({ variant: "outline", className: "flex-1", children: "Learn More" })}
                                       ${Button({ className: "flex-1", children: "Register Now" })}
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${Card({
                           children: html`
                              ${CardHeader({
                                 children: html`
                                    ${CardTitle({ children: "Monthly Statistics" })}
                                    ${CardDescription({ children: "Performance overview for March 2024" })}
                                 `,
                              })}
                              ${CardContent({
                                 children: html`
                                    <div class="grid grid-cols-2 gap-4">
                                       <div class="text-center">
                                          <div class="text-2xl font-bold">12.4K</div>
                                          <div class="text-sm text-muted-foreground">Page views</div>
                                          ${Badge({ variant: "secondary", className: "mt-1", children: "+12%" })}
                                       </div>
                                       <div class="text-center">
                                          <div class="text-2xl font-bold">847</div>
                                          <div class="text-sm text-muted-foreground">New users</div>
                                          ${Badge({ variant: "secondary", className: "mt-1", children: "+8%" })}
                                       </div>
                                       <div class="text-center">
                                          <div class="text-2xl font-bold">3.2%</div>
                                          <div class="text-sm text-muted-foreground">Bounce rate</div>
                                          ${Badge({ variant: "destructive", className: "mt-1", children: "-0.5%" })}
                                       </div>
                                       <div class="text-center">
                                          <div class="text-2xl font-bold">2m 34s</div>
                                          <div class="text-sm text-muted-foreground">Avg. session</div>
                                          ${Badge({ variant: "secondary", className: "mt-1", children: "+15s" })}
                                       </div>
                                    </div>
                                 `,
                              })}
                              ${CardFooter({
                                 children: html`
                                    ${Button({
                                       variant: "outline",
                                       className: "w-full",
                                       children: "View Detailed Report",
                                    })}
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Event card with badge and details
\${Card({
  children: html\`
    \${CardHeader({
      children: html\`
        <div class="flex items-start justify-between">
          <div>
            \${CardTitle({ children: "Tech Conference 2024" })}
            \${CardDescription({ children: "Annual technology summit" })}
          </div>
          \${Badge({ children: "Upcoming" })}
        </div>
      \`
    })}
    \${CardContent({
      children: html\`
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm">
            \${icon(Calendar, "sm")}
            <span>March 15-17, 2024</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            \${icon(MapPin, "sm")}
            <span>San Francisco, CA</span>
          </div>
          \${Separator()}
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Attendees</span>
            <span class="text-sm text-muted-foreground">1,247 registered</span>
          </div>
        </div>
      \`
    })}
    \${CardFooter({
      children: html\`
        <div class="flex gap-2 w-full">
          \${Button({ variant: "outline", className: "flex-1", children: "Learn More" })}
          \${Button({ className: "flex-1", children: "Register Now" })}
        </div>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Nested Cards -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Nested Cards</h2>

               <preview-code
                  .preview=${html`
                     ${Card({
                        children: html`
                           ${CardHeader({
                              children: html`
                                 ${CardTitle({ children: "Dashboard Overview" })}
                                 ${CardDescription({ children: "Quick access to your most important metrics" })}
                              `,
                           })}
                           ${CardContent({
                              children: html`
                                 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    ${Card({
                                       className: "bg-muted/50",
                                       children: html`
                                          ${CardContent({
                                             className: "p-4",
                                             children: html`
                                                <div class="flex items-center gap-2">
                                                   ${icon(Star, "sm")}
                                                   <div>
                                                      <div class="font-medium">4.8</div>
                                                      <div class="text-xs text-muted-foreground">Rating</div>
                                                   </div>
                                                </div>
                                             `,
                                          })}
                                       `,
                                    })}
                                    ${Card({
                                       className: "bg-muted/50",
                                       children: html`
                                          ${CardContent({
                                             className: "p-4",
                                             children: html`
                                                <div class="flex items-center gap-2">
                                                   ${icon(User, "sm")}
                                                   <div>
                                                      <div class="font-medium">2,847</div>
                                                      <div class="text-xs text-muted-foreground">Users</div>
                                                   </div>
                                                </div>
                                             `,
                                          })}
                                       `,
                                    })}
                                    ${Card({
                                       className: "bg-muted/50",
                                       children: html`
                                          ${CardContent({
                                             className: "p-4",
                                             children: html`
                                                <div class="flex items-center gap-2">
                                                   ${icon(Activity, "sm")}
                                                   <div>
                                                      <div class="font-medium">98.2%</div>
                                                      <div class="text-xs text-muted-foreground">Uptime</div>
                                                   </div>
                                                </div>
                                             `,
                                          })}
                                       `,
                                    })}
                                 </div>
                              `,
                           })}
                        `,
                     })}
                  `}
                  code=${`// Nested cards for dashboard metrics
\${Card({
  children: html\`
    \${CardHeader({
      children: html\`
        \${CardTitle({ children: "Dashboard Overview" })}
        \${CardDescription({ children: "Quick access to your most important metrics" })}
      \`
    })}
    \${CardContent({
      children: html\`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          \${Card({
            className: "bg-muted/50",
            children: html\`
              \${CardContent({
                className: "p-4",
                children: html\`
                  <div class="flex items-center gap-2">
                    \${icon(Star, "sm")}
                    <div>
                      <div class="font-medium">4.8</div>
                      <div class="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                \`
              })}
            \`
          })}
          <!-- More nested cards... -->
        </div>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Components</h3>

                     <div class="space-y-6">
                        <!-- Card -->
                        <div>
                           <h4 class="font-semibold mb-2">Card</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Card content</td>
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

                        <!-- CardHeader -->
                        <div>
                           <h4 class="font-semibold mb-2">CardHeader</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Header content</td>
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

                        <!-- CardTitle -->
                        <div>
                           <h4 class="font-semibold mb-2">CardTitle</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Title text</td>
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

                        <!-- CardDescription -->
                        <div>
                           <h4 class="font-semibold mb-2">CardDescription</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Description text</td>
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

                        <!-- CardContent -->
                        <div>
                           <h4 class="font-semibold mb-2">CardContent</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Main content</td>
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

                        <!-- CardFooter -->
                        <div>
                           <h4 class="font-semibold mb-2">CardFooter</h4>
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
                                       <td class="py-2 pr-4">children</td>
                                       <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                       <td class="py-2 pr-4 text-muted-foreground">-</td>
                                       <td class="py-2 font-sans">Footer content</td>
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
                     </div>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}
