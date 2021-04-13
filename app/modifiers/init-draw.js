import { modifier } from 'ember-modifier';
import { create } from "simple-drawing-board";

export default modifier(function initDraw(el, [registerCard, back]) {
   // TODO - Define at real card width
   el.setAttribute('width', el.parentNode.clientWidth);
   el.setAttribute('height', el.parentNode.clientHeight);

   // Init SDB
   const sdb = create(el);
   sdb.setLineSize(3);

   // Register instance on controller
   registerCard(sdb, back);
});
