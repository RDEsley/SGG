import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masks'
})
export class MasksPipe implements PipeTransform {

  transform(value: any, type: string): string {
    if (!value) return '';

    switch (type) {
      case 'currency':
        return this.formatCurrency(value);
      case 'date':
        return this.formatDate(value);
      case 'number':
        return this.formatNumber(value);
      default:
        return value;
    }
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  private formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
  }
}
