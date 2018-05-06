import { NgModule } from '@angular/core';
import { MatCardModule, MatToolbarModule, MatButtonModule } from '@angular/material';

const MATERIAL_IMPORTS = [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
];

@NgModule({
    imports: [MATERIAL_IMPORTS],
    exports: [MATERIAL_IMPORTS]
})
export class MaterialSharedModule { }
