import {
  Bl,
  BlCode,
  BlMethod,
  BlStack,
  Layer,
  ResponseProto,
} from '../../types';

function isBlMethodArray<L>(
  methodOrMethods: BlMethod<L> | BlMethod<L>[],
): methodOrMethods is BlMethod<L>[] {
  return Array.isArray(methodOrMethods);
}

export class BlResponseCreator<L extends Bl> {
  private readonly LOGIC_CONFIG: L;
  private readonly serviceName: string;
  private readonly layer: Layer;

  constructor(LOGIC_CONFIG: L, serviceName: string, layer: Layer) {
    this.LOGIC_CONFIG = LOGIC_CONFIG;
    this.serviceName = serviceName;
    this.layer = layer;
  }

  createBuilders<M extends BlMethod<L> | BlMethod<L>[]>(methodOrMethods: M) {
    const buildResponse = <
      C extends M extends BlMethod<L>[]
        ? BlCode<L, M[number]>
        : M extends BlMethod<L>
          ? BlCode<L, M>
          : never,
      D = undefined,
    >(
      code: C,
      success: boolean,
      data?: D,
    ) => {
      const res = {
        success,
        serviceName: this.serviceName,
        layer: this.layer,
        code,
        blStack: [] as BlStack<L>,
        data,
      };

      if (isBlMethodArray(methodOrMethods)) {
        methodOrMethods.forEach((method) => {
          const methodLogic = this.LOGIC_CONFIG[method];
          if (code in methodLogic) {
            res.blStack.push({
              method,
              message: methodLogic[code as keyof typeof methodLogic]['en'],
            });
          }
        });
      } else {
        const method = methodOrMethods as BlMethod<L>;
        const methodLogic = this.LOGIC_CONFIG[method];
        if (code in methodLogic) {
          res.blStack.push({
            method,
            message: methodLogic[code as keyof typeof methodLogic]['en'],
          });
        }
      }

      return res as ResponseProto<M, D, L>;
    };

    const buildSuccess = <
      C extends M extends BlMethod<L>[]
        ? BlCode<L, M[number]>
        : M extends BlMethod<L>
          ? BlCode<L, M>
          : never,
      D = undefined,
    >(
      code: C,
      data?: D,
    ) => {
      return buildResponse(code, true, data);
    };

    const buildFailure = <
      C extends M extends BlMethod<L>[]
        ? BlCode<L, M[number]>
        : M extends BlMethod<L>
          ? BlCode<L, M>
          : never,
      D = undefined,
    >(
      code: C,
      data?: D,
    ) => {
      return buildResponse(code, false, data);
    };

    const throwFailure = function <
      H extends new (...args: any[]) => Error,
      C extends M extends BlMethod<L>[]
        ? BlCode<L, M[number]>
        : M extends BlMethod<L>
          ? BlCode<L, M>
          : never,
    >(ExceptionClass: H, code: C) {
      throw new ExceptionClass(code);
    };

    return { buildSuccess, buildFailure, throwFailure };
  }
}
