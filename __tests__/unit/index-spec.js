import { expect } from 'chai';

import { GM, Wheel } from '../../src';

describe('g-gesture', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  it('export', () => {
    expect(GM).to.be.not.undefined;
    expect(Wheel).to.be.not.undefined;
  });
});
