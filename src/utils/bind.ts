/**
 * https://github.com/NoHomey/bind-decorator/blob/master/src/index.ts
 */
export function bind() {
  return function <T extends Function>(
    target: Object,
    property: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void {
    return {
      configurable: true,
      get(this: T): T {
        const bound: T = descriptor.value!.bind(this);

        Object.defineProperty(this, property, {
          value: bound,
          configurable: true,
          writable: true,
        });

        return bound;
      },
    };
  };
}
