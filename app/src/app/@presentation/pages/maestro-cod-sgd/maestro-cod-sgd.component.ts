import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CodSgdModel } from 'src/app/@data/model/cod-sgd.model';
import { ValidatorService } from 'src/app/@data/services/validator.service';

@Component({
  selector: 'app-maestro-cod-sgd',
  templateUrl: './maestro-cod-sgd.component.html',
  styleUrls: ['./maestro-cod-sgd.component.scss']
})
export class MaestroCodSgdComponent implements OnInit {
  codSgdDialog: boolean = false
  deleteCodSgdDialog: boolean = false;
  codSgd: CodSgdModel;
  codsSgd: CodSgdModel[];
  codSgdID: number;
  descripcion: string = '';
  pide: string = '1';
  submitted: boolean;
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  rowsPerPageOptions = [5, 10, 20];
  disabled: boolean = false;

  newCodSgdForm: FormGroup = this.fb.group({
    asunto: ['', [Validators.required, Validators.maxLength(30)]],
    celular: ['', [Validators.required, Validators.maxLength(10)]],
    remitente: ['', [Validators.required, Validators.maxLength(25)]],
    correo: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
    fecha: ['', [Validators.required]]
  });

  newCodSgd!: CodSgdModel;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService
  ) { }

  ngOnInit(): void {
    this.codsSgd = [
      {
        codSgdId: 1,
        asunto: 'Solicitud de arbitraje',
        fechaEmision: new Date('02-02-2023'),
        celular: '987658980',
        remitente: 'Juan',
        correo: 'correo@gmail.com'
      },
      {
        codSgdId: 2,
        asunto: 'Solicitud de arbitraje',
        fechaEmision: new Date('02-02-2023'),
        celular: '987658980',
        remitente: 'Luis',
        correo: 'correo@gmail.com'
      },
      {
        codSgdId: 3,
        asunto: 'Solicitud de arbitraje',
        fechaEmision: new Date('02-02-2023'),
        celular: '987658980',
        remitente: 'Manuel',
        correo: 'correo@gmail.com'
      }
    ];

  }

  openDialog(dialogType: string, codSgdId?: number) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.codSgd = {};
        this.submitted = false;
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.codSgd = {...this.codsSgd.find(cod => cod.codSgdId === codSgdId)};
        this.newCodSgdForm.setValue({
          asunto: this.codSgd.asunto,
          fecha: this.codSgd.fechaEmision,
          celular: this.codSgd.celular,
          remitente: this.codSgd.remitente,
          correo: this.codSgd.correo
        })
        this.submitted = false;
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.codSgd = {...this.codsSgd.find(cod => cod.codSgdId === codSgdId)};
        this.newCodSgdForm.setValue({
          asunto: this.codSgd.asunto,
          fecha: this.codSgd.fechaEmision,
          celular: this.codSgd.celular,
          remitente: this.codSgd.remitente,
          correo: this.codSgd.correo
        })
        this.submitted = false;
        break;
      }
    }
    this.operationType = dialogType;
    this.codSgdDialog = true;
  }

  deleteCodSgd(codSgdId: number) {
    this.codSgdID = codSgdId;
    this.deleteCodSgdDialog = true;
  }

  confirmDelete(){
    this.deleteCodSgdDialog = false;
  }

  hideDialog() {
    this.codSgdDialog = false;
    this.submitted = false;
    this.newCodSgdForm.reset();
  }

  hideDeleteCodSgdDialog() {
    this.deleteCodSgdDialog = false;
  }

  saveNewRecord() {
    this.newCodSgd = {
      asunto: this.newCodSgdForm.get('asunto')?.value,
      fechaEmision: this.newCodSgdForm.get('fecha')?.value,
      celular: this.newCodSgdForm.get('celular')?.value,
      remitente: this.newCodSgdForm.get('remitente')?.value,
      correo: this.newCodSgdForm.get('correo')?.value
    }
    this.codsSgd = [...this.codsSgd, this.newCodSgd];
    this.codSgdDialog = false;
    this.newCodSgdForm.reset();
  }

  deleteRecord() {
    this.codsSgd = this.codsSgd.filter(cod => cod.codSgdId !== this.codSgdID);
    this.deleteCodSgdDialog = false;
  }

  invalidField(field: string) {
    return this.newCodSgdForm.get(field)?.invalid && this.newCodSgdForm.get(field)?.touched;
  }
}
