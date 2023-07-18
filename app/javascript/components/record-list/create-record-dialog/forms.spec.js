import { searchForm } from './forms';

describe('<CreateRecordDialog /> - forms', () => {
    const i18n = { t: value => value };
  
    it('searchForm should return an object', () => {
      const form = searchForm(i18n);
      expect(form).toBeInstanceOf(Object);
    });
  });