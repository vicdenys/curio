import { Animation, PageTransition } from 'ionic-angular';

export class ModalSlideDownTransition extends PageTransition {

public init() {
  console.log(this.enteringView);
    const ele = this.enteringView.pageRef().nativeElement;
    const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

    wrapper.beforeStyles({ 'transform': 'translateY(-100%)', 'opacity': 1 });
    wrapper.fromTo('transform', 'translateY(-100%)', 'translateY(0)');
    wrapper.fromTo('opacity', 1, 1);

    this
        .element(this.enteringView.pageRef())
        .duration(300)
        .easing('cubic-bezier(.31,.13,.79,1)')
        .add(wrapper);
}
}
