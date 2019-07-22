import { getElement } from "@stencil/core";

interface Component {
  connectedCallback?: Function,
  disconnectedCallback?: Function,
}

interface IocRequest {
  name: string,
  result?: any,
}

export function Inject(): PropertyDecorator {
  return function(proto: Component, propertyKey: string) {
    const { connectedCallback } = proto;

    proto.connectedCallback = function() {
      let e = new CustomEvent<IocRequest>('ioc:request', {
        detail: {name: propertyKey},
        bubbles: true,
        composed: true,
        cancelable: true,
      });

      getElement(this).dispatchEvent(e);

      if(e.detail.result)
        this[propertyKey] = e.detail.result;

      return connectedCallback && connectedCallback.call(this);
    };
  }
}

export function Service(): PropertyDecorator {
  return function(proto: Component, propertyKey: string) {
    const { connectedCallback } = proto;

    proto.connectedCallback = function() {
      getElement(this).addEventListener('ioc:request', (e: CustomEvent<IocRequest>) => {
        if (e.detail.name === propertyKey) {
          e.stopImmediatePropagation();
          e.detail.result = this[propertyKey];
        }
      }, {capture: true});

      return connectedCallback && connectedCallback.call(this);
    };

    // proto.component
  }
}
