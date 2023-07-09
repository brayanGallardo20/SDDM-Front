import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'puesto-modal-eliminar',
  templateUrl: './modal-eliminar.component.html',
  styleUrls: ['./modal-eliminar.component.scss']
})
export class ModalEliminarComponent implements OnInit {
  @Input() title = 'Eliminar';
  @Input() bodyText = '¿Está seguro que desea continuar?';
  @Input() link = null;

  constructor(

    private route: Router
    ) { }

  ngOnInit(): void {
  }

}

export interface ModalConfirmationModel {
  title: string;
  bodyText: string;
  textCancel: string;
  textOk: string;
  link?: string;
} 
