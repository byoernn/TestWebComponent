import { WebComponent } from '../web.component.js';

const templateUrl = "/components/app-component/app.component.html";
const styleUrl = "/components/app-component/app.component.css";
export const tagName = "my-app";
export class MyApp extends WebComponent {
   constructor(){
    super(templateUrl,styleUrl);
   }
}