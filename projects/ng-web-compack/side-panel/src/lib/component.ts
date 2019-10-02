import {
    Component
    , ViewChild
    , HostListener
    , ElementRef
    , OnInit
} from '@angular/core';


@Component({
    selector: 'lib-side-panel',
    templateUrl: './template.html',
    styleUrls: ['./style.styl']
})
export class SidePanelComponent implements OnInit {

    private triggerElements: EventTarget[];

    private retracted: boolean;

    private eventTarget: EventTarget;

    private _container: HTMLDivElement;

    private inlineStyle: CSSStyleDeclaration;

    private _containerElementRef: ElementRef<HTMLDivElement>;
    @ViewChild('container', { static: true })
    private set container(value: any) {
        if (value) {
            this._containerElementRef = value;
            this._container = this._containerElementRef.nativeElement;

            this.inlineStyle = this._container.style;
            this.inlineStyle.width = '0px';
        }
    }

    @HostListener('document:click', ['$event'])
    onHostClick(event: Event) {

        this.eventTarget = event.target;

        if (
            (
                this.triggerElements.length
                && !this.triggerElements.includes(event.target)
            )

            && !this._containerElementRef.nativeElement.contains(event.target as Node)
            && !this.retracted
        ) {
            this.recall();
        }

        if (!this.retracted) {
            this.recordReleaseTriggerElement(event.target);
        }

    }

    constructor(

    ) {
        this.retracted = true;
        this.triggerElements = [];
    }

    ngOnInit() {

    }

    toggle() {
        debugger
        if (this.retracted) {
            this.release();
        } else {
            this.recall();
        }
    }

    private release() {
        let containerParent: Node;

        let containerClone: HTMLElement;

        let computedStyle: CSSStyleDeclaration;

        let inlineStyle: CSSStyleDeclaration;

        let computedWidth: string;

        containerClone = this._container.cloneNode(true) as HTMLElement;
        containerParent = this._container.parentElement;

        computedStyle = window.getComputedStyle(containerClone);

        inlineStyle = containerClone.style;
        inlineStyle.visibility = 'hidden';

        if (containerParent) {
            containerParent.appendChild(containerClone);
            inlineStyle.width = '';

            computedWidth = computedStyle.width;

            containerParent.removeChild(containerClone);
        } else {
            computedWidth = `${window.document.documentElement.offsetWidth}px`;
        }

        this.inlineStyle.width = computedWidth;

        this.retracted = false;
    }

    private recall() {
        this.inlineStyle.width = '0px';
        this.retracted = true;
    }

    private recordReleaseTriggerElement(eventTarget: EventTarget) {
        if (eventTarget && !this.triggerElements.includes(eventTarget)) {
            this.triggerElements.push(eventTarget);
        }
    }

}
