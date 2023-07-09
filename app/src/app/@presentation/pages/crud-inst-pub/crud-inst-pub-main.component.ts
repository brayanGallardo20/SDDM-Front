import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstPubService } from 'src/app/@data/services/inst-pub.service';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-crud-inst-pub-main',
  templateUrl: './crud-inst-pub-main.component.html',
  styleUrls: ['./crud-inst-pub-main.component.scss']
})
export class CrudInstPubMainComponent implements OnInit {

  tipoOperadorArbitralId: number = 1;
  labelInstitution: string = '';
  tipoInstitution: string = '';
  insitutionId: any;
  isDisabled: boolean = true;
  isLoadComponent: boolean = true;

  typeTransaction: string = '';
  constructor(
    private router: Router,
    private instPubService: InstPubService 
  ) { 

    this.instPubService.getInstitucionId().subscribe( res=>{
      console.log(res)
        this.insitutionId = res; 
        if(this.insitutionId>0) {
          this.isDisabled = false;
          this.isLoadComponent = true;
        } 
    })

  }
 
  ngOnInit(): void {
    const urlCompelto = this.router.url.split("/");
    this.tipoInstitution = urlCompelto[urlCompelto.length - 3];
    
    this.typeTransaction = urlCompelto[urlCompelto.length - 2];
    this.insitutionId = urlCompelto[urlCompelto.length - 1];

    if(this.insitutionId!=='0') {
      this.isDisabled = false;
    }
    if(this.typeTransaction == 'new') {
         this.isLoadComponent = false;
    }
    this.tipoOperadorArbitralId = Utils.obtenerIdOperadorArbitral(this.tipoInstitution);
    this.labelInstitution = Utils.obtenerLabelOperadorArbitral(this.tipoInstitution);
  }

  goBack() {
    this.router.navigate(['pages/institution/'+this.tipoInstitution]);
  }
}
