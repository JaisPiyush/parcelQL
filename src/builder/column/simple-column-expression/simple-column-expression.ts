import { ParcelQLValidationError } from '../../../error';
import {
    ParcelQLSimpleColumnExpressionWithType
} from '../../../schema/column-expression/base-column-expression';
import { BaseQueryBuilder } from '../../base-query-builder';



export class ParcelQLSimpleColumnExpressionBuilder 
    extends BaseQueryBuilder<ParcelQLSimpleColumnExpressionWithType> {
    
    
    protected _isProvisionedQuery(){
        if (
            this.query.column === undefined ||
            this.query.column === null ||
            this.query.column.length === 0
        ) {
            throw new ParcelQLValidationError(
                `column value "${this.query.column}" is not valid`
            );
        }

        if (
            typeof this.query.type === 'undefined' ||
            typeof this.query.type === 'string' ||
            Array.isArray(this.query.type)
        ) {
            return;
        }
        throw new ParcelQLValidationError(
            `column typecasting to "${this.query.type}" is not valid`
        );

    }


}
