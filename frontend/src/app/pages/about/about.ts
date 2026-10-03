import { Component } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  imports: [HeaderComponent],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {
}
