import { Pipe, PipeTransform } from '@angular/core';
import { global_variables } from '../../environments/global_variables';

@Pipe({
  name: 'analyticDataFilter'
})
export class AnalyticDataFilterPipe implements PipeTransform {
  transform(objData: Object, objInputData: Object, arrStrTargetKeys: string[], bIsShow: boolean): any {
    let arrReturns = [];
    const arrInputs = [];
    const arrOptions = [];
    const arrInputKeys = global_variables['AnalyticalInputs'];

    for (const key in objData) {
      if (arrStrTargetKeys.indexOf(key) === -1) {
        arrReturns.push({key: key, value: objData[key]});
      } else if ((arrStrTargetKeys.indexOf(key) !== -1) && bIsShow) {
        arrOptions.push({key: key, value: objData[key]});
      }
    }

    for (let i = 0; i < arrInputKeys.length; i++) {
      const strKey = arrInputKeys[i];
      let strVal = '';

      if (objInputData && objInputData.hasOwnProperty(strKey)) {
        strVal = objInputData[strKey];
      }

      arrInputs.push({key: strKey, value: strVal});
    }

    if (arrInputs.length > 0) {
      arrReturns = arrReturns.concat(arrInputs);
    }

    if (bIsShow && arrOptions.length > 0) {
      arrReturns = arrReturns.concat(arrOptions);
    }

    return arrReturns;
  }
}
