import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApi } from '../../models/api/gridApi';
import { useLogger } from '../utils/useLogger';

export function useGridApiMethod<T extends Partial<GridApi>>(
  apiRef: GridApiRef,
  apiMethods: T,
  apiName: string,
) {
  const logger = useLogger('useGridApiMethod');
  const apiMethodsRef = React.useRef(apiMethods);

  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);

  React.useEffect(() => {
    if (!apiRef.current.isInitialised) {
      return;
    }

    Object.keys(apiMethods).forEach((methodName) => {
      if (!apiRef.current.hasOwnProperty(methodName)) {
        logger.debug(`Adding ${apiName}.${methodName} to apiRef`);
        apiRef.current[methodName] = (...args) => {
          return apiMethodsRef.current[methodName](...args);
        };
      }
    });
  }, [apiMethods, apiName, apiRef, logger]);
}
