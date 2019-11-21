import { IParams } from '../../src/common/template.service';

export class TemplateServiceStub {
    public apply(params: IParams, data: any): string {
        return JSON.stringify(data);
    }
}
