import transformer from '@/transformers/transformer';

describe('Transformers', () => {
  describe('Base', () => {
    // setup an example transformer
    transformer.fetch = obj => Object.keys(obj)[0];
    transformer.send = obj => obj[Object.keys(obj)[0]];

    it('should fetch an object', () => {
      const original = { foo: 'bar' };
      const transformed = 'foo';
      expect(transformer.fetch(original)).to.deep.equal(transformed);
    });

    it('should send an object', () => {
      const original = { foo: 'bar' };
      const transformed = 'bar';
      expect(transformer.send(original)).to.deep.equal(transformed);
    });

    it('should fetch Collections', () => {
      const original = [{ foo: 'bar' }, { bar: 'foo' }];
      const transformed = ['foo', 'bar'];
      expect(transformer.fetchCollection(original)).to.deep.equal(transformed);
    });

    it('should send Collections', () => {
      const original = [{ foo: 'bar' }, { bar: 'foo' }];
      const transformed = ['bar', 'foo'];
      expect(transformer.sendCollection(original)).to.deep.equal(transformed);
    });
  });
});
