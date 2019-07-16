import { getElement } from "@stencil/core";

interface IocComponent {
  connectedCallback?: Function,
  disconnectedCallback?: Function,
}

interface IocRequest {
  name: string,
  result?: any,
}

export function Inject(): PropertyDecorator {
  return function(proto: IocComponent, propertyKey: string) {
    const { connectedCallback } = proto;

    proto.connectedCallback = function() {
      let e = new CustomEvent<IocRequest>('ioc:request', {
        detail: {name: propertyKey},
        bubbles: true,
      });

      getElement(this).dispatchEvent(e);

      if(e.detail.result)
        this[propertyKey] = e.detail.result;

      return connectedCallback && connectedCallback.call(this);
    };
  }
}

export function Service(): PropertyDecorator {
  return function(proto: IocComponent, propertyKey: string) {
    const { connectedCallback } = proto;

    proto.connectedCallback = function() {
      getElement(this).shadowRoot.addEventListener('ioc:request', (e: CustomEvent<IocRequest>) => {
        console.log('ioc:request intercepted', this)
        e.detail.result = this[propertyKey]
      });
    };

    // proto.component
  }
}
