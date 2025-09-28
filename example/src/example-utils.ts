import { html, type TemplateResult } from "lit";
import * as parserBabel from "prettier/plugins/babel";
import * as parserEstree from "prettier/plugins/estree";
import * as parserHtml from "prettier/plugins/html";
import * as prettier from "prettier/standalone";
import dedent from "string-dedent";

/**
 * Format code using Prettier
 */
async function formatCode(code: string, parser: "babel" | "html" = "babel"): Promise<string> {
   try {
      return await prettier.format(code, {
         parser,
         plugins: [parserBabel, parserEstree as any, parserHtml],
         printWidth: 80,
         tabWidth: 3,
         useTabs: false,
         semi: true,
         singleQuote: false,
         trailingComma: "es5",
         bracketSpacing: true,
      });
   } catch (error) {
      console.warn("Prettier formatting failed:", error);
      return code; // Return unformatted code if formatting fails
   }
}

/**
 * Utility to create a code example with source and rendered output
 * @param exampleFn A function that returns the example template
 * @param imports Optional import statements to prepend
 * @returns Object with source code and rendered template
 */
export async function createExample(
   exampleFn: () => TemplateResult,
   imports?: string,
): Promise<{ source: string; template: TemplateResult }> {
   // Get the function source
   const fnSource = exampleFn.toString();

   // Extract the function body
   let body: string;

   // Check if it's an arrow function with html template literal
   if (fnSource.includes("=> html`")) {
      // Extract everything after "=> html`" and before the last backtick
      const match = fnSource.match(/=>\s*html`([\s\S]*)`$/);
      if (match) {
         const templateContent = match[1];
         // Dedent the template content
         const dedented = dedent(templateContent);
         body = `html\`\n${dedented.trim()}\n\``;
      } else {
         body = fnSource;
      }
   } else if (fnSource.includes("=>") && !fnSource.includes("{")) {
      // Arrow function with implicit return
      body = fnSource.split("=>")[1].trim();
   } else {
      // Regular function or arrow with block body
      const bodyMatch = fnSource.match(/{\s*([\s\S]*?)\s*}$/);
      body = bodyMatch ? dedent(bodyMatch[1]).trim() : fnSource;
   }

   // Build the source with imports
   const sourceWithImports = imports ? `${imports}\n\n${body}` : body;

   // Format with prettier - use appropriate parser
   const formattedSource = await formatCode(sourceWithImports, "babel");

   // Execute the function to get the template
   const template = exampleFn();

   return { source: formattedSource, template };
}

/**
 * Renders an example with code block and output
 */
export async function renderExample(
   title: string,
   exampleFn: () => TemplateResult,
   imports?: string,
   language: string = "typescript",
): Promise<TemplateResult> {
   const { source, template } = await createExample(exampleFn, imports);

   return html`
      <div class="p-6">
         <h3 class="font-semibold mb-4 text-foreground">${title}</h3>
         <code-block
            .code="${source}"
            language="${language}"
         ></code-block>
         <div class="mt-4">
            ${template}
         </div>
      </div>
   `;
}

/**
 * Create examples for both functional and web components
 */
export async function createComponentExamples(
   functionalExample: () => TemplateResult,
   webComponentExample: () => TemplateResult,
   functionalImports: string,
   webComponentImports: string,
): Promise<TemplateResult> {
   const [functionalResult, webComponentResult] = await Promise.all([
      renderExample("Functional Component", functionalExample, functionalImports),
      renderExample("Web Component", webComponentExample, webComponentImports, "html"),
   ]);

   return html`
      <div class="grid gap-6 md:grid-cols-2">
         ${functionalResult}
         ${webComponentResult}
      </div>
   `;
}
