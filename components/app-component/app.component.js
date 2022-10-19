import { WebComponent } from '../web.component.js';

const templateUrl = "components/app-component/app.component.html";
const styleUrl = "components/app-component/app.component.css";
export const selector = "my-app";
export class MyApp extends WebComponent {
   constructor(){
    super(templateUrl,styleUrl);
   }
   async connectedCallback(){
      await super.connectedCallback();
      console.log(this._shadowRoot.innerHTML);
   }
}
