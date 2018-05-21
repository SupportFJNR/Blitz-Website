import { Component, OnInit } from '@angular/core';
import { AcademicField } from '../../../../models/academicField';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicFieldService } from '../../../../services/academic-field.service';
import { AcademicLevelService } from '../../../../services/academic-level.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-academics-page',
  templateUrl: './academics-page.component.html',
  styleUrls: ['./academics-page.component.scss']
})
export class AcademicsPageComponent implements OnInit {

  listAcademicFields: AcademicField[];
  listAcademicLevels: AcademicLevel[];

  fieldForm: FormGroup;
  fieldErrors: string[];
  selectedFieldUrl: string;

  levelForm: FormGroup;
  levelErrors: string[];
  selectedLevelUrl: string;

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.refreshFieldList();
    this.refreshLevelList();

    this.fieldForm = this.formBuilder.group(
      {
        name: null
      }
    );

    this.levelForm = this.formBuilder.group(
      {
        name: null
      }
    );
  }

  refreshLevelList() {
    this.academicLevelService.list().subscribe(
      levels => {
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
      }
    );
  }

  refreshFieldList() {
    this.academicFieldService.list().subscribe(
      fields => {
        this.listAcademicFields = fields.results.map(f => new AcademicField(f));
      }
    );
  }

  OpenModalCreateField() {
    this.fieldForm.reset();
    this.selectedFieldUrl = null;
    this.toogleModal('form_academic_fields', 'Ajouter un domaine d\'etude', 'Creer');
  }

  OpenModalEditField(item) {
    this.fieldForm.controls['name'].setValue(item.name);
    this.selectedFieldUrl = item.url;
    this.toogleModal('form_academic_fields', 'Editer un domaine d\'etude', 'Editer');
  }

  submitField() {
    if ( this.fieldForm.valid ) {
      if (this.selectedFieldUrl) {
        this.academicFieldService.update(this.selectedFieldUrl, this.fieldForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
              console.log(this.fieldErrors);
            }
            if (err.error.name) {
              this.fieldForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.academicFieldService.create(this.fieldForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
              console.log(this.fieldErrors);
            }
            if (err.error.name) {
              this.fieldForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removeField(item) {
    console.log('bad!');
    this.academicFieldService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'Le domaine d\'étude a bien été supprimé.');
        this.refreshFieldList();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
      }
    );
  }

  toogleModal(name, title = '', button2 = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  OpenModalCreateLevel() {
    this.levelForm.reset();
    this.selectedLevelUrl = null;
    this.toogleModal('form_academic_levels', 'Ajouter un niveau d\'etude', 'Creer');
  }

  OpenModalEditLevel(item) {
    this.levelForm.controls['name'].setValue(item.name);
    this.selectedLevelUrl = item.url;
    this.toogleModal('form_academic_levels', 'Editer un niveau d\'etude', 'Editer');
  }

  submitLevel() {
    if ( this.levelForm.valid ) {
      if (this.selectedLevelUrl) {
        this.academicLevelService.update(this.selectedLevelUrl, this.levelForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
              console.log(this.levelErrors);
            }
            if (err.error.name) {
              this.levelForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.academicLevelService.create(this.levelForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
              console.log(this.levelErrors);
            }
            if (err.error.name) {
              this.levelForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removeLevel(item) {
    this.academicLevelService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'Le niveau d\'étude a bien été supprimé.');
        this.refreshLevelList();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
      }
    );
  }
}
