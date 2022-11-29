import { format } from './duration';

describe('format', () => {
  it('parses seconds into MM:SS', () => {
    expect(format(4)).toEqual('00:04');
  });

  it('parses minutes into MM:SS', () => {
    expect(format(60)).toEqual('01:00');
  });

  it('parses hours into HH:MM:SS', () => {
    expect(format(3600)).toEqual('01:00:00');
  });

  it('parses days into HH:MM:SS', () => {
    expect(format(94122)).toEqual('26:08:42');
  });

  it('parses negative seconds into -MM:SS', () => {
    expect(format(-42)).toEqual('-00:42');
  });

  it('parses negative minutes into -MM:SS', () => {
    expect(format(-65)).toEqual('-01:05');
  });

  it('parses negative hours into -HH:MM:SS', () => {
    expect(format(-3600)).toEqual('-01:00:00');
  });
});
