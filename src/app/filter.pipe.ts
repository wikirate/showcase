import {Pipe, PipeTransform} from '@angular/core';
import {Company} from './models/company.model';

@Pipe({
  name: 'companyFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Company[], searchText: string): Company[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

}
