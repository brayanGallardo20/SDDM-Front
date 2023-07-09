import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'puesto-modal-registrar',
  templateUrl: './modal-registrar.component.html',
  styleUrls: ['./modal-registrar.component.scss']
})
export class ModalRegistrarComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

}

export interface DataModel {
  createMode: boolean;
  dataToEdit: any;
  estados: any[];
}

