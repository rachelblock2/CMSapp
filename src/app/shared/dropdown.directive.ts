import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})

export class DropdownDirective {
    @HostBinding('class.open') isOpen = false; //allows us to bind to properties the element is placed on

    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}