import { MessageService } from "primeng/api";
import { Utils } from "src/app/util/utils";

export class FunctionHelpers{

    messageService!:MessageService;

    constructor(){

    }

    static formatDateToString(inputDate: Date, typeFormat: string): string {
        let response: string = '';
        let date, month, year;
        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();
        date = date
            .toString()
            .padStart(2, '0'); 
        month = month
            .toString()
            .padStart(2, '0'); 
       if (typeFormat === 'dd/mm/yyyy') {
            response = `${date}/${month}/${year}`;
        } else if (typeFormat === 'yyyy-mm-dd') {
            response = `${year}-${month}-${date}`;
        }
        return response;
    }
}