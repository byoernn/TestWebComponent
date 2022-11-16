export class WebComponent extends HTMLElement {
    /** 
     * @type {ShadowRoot} 
     * @protected
     */
    _shadowRoot;
    /** @type {string} */
    #templateUrl;
    /** @type {string} */
    #styleUrl;
    /** 
     * @param {string} templateUrl 
     * @param {string} [styleUrl]
     */
    constructor(templateUrl,styleUrl){
        super();
        this.#templateUrl = templateUrl;
        this.#styleUrl = styleUrl;
    }

    /**
     * This function is called when the Web Component is appended to a Document Object Model. 
     * It should run any required rendering.
     */
    async connectedCallback() {
        this._shadowRoot = this.attachShadow({ mode: 'closed' });
        //set style
        if(this.#styleUrl){
            try{
                // @ts-ignore
                const cssModule = await import(this.#styleUrl, {
                    assert: { type: 'css' }
                });
                this._shadowRoot.adoptedStyleSheets = [cssModule.default];
            }catch{}
        }
        //set content
        let content = await fetch(this.#templateUrl);
        //need use innerHTML so content is not interpreted as text
        this._shadowRoot.innerHTML = await content.text();
    }

    /**
     * It’s called when the Web Component is removed from a Document Object Model
     */
    disconnectedCallback(){}

    /**
     * Called whenever an observed attribute is changed. 
     * Those defined in HTML are passed immediately.
     * @param {string} propertyName 
     * @param {any} oldValue 
     * @param {any} newValue 
     */
    attributeChangedCallback(propertyName, oldValue, newValue){}

}