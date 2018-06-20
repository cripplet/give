MONTHS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC']

MONTHS_DAY = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def n_sec(time_string, acc, power):
  if not time_string:
    return acc

  parts = time_string.rsplit(':', 1)
  if len(parts) == 1:
    res, part = '', parts[0]
  else:
    res, part = parts[0], parts[-1]

  return n_sec(res, acc + int(part) * 60 ** power, power + 1)

class Run(object):
  def __init__(self,
               month,
               day,
               steps,
               miles,
               time_string):
    self.month = MONTHS.index(month.upper()) + 1
    self.day = int(day)
    self.steps = float(steps)
    self.miles = float(miles)
    self.time = n_sec(time_string, 0, 0)

  @property
  def pace(self):
    return float(self.time) / 60 / self.miles

  @property
  def ppm(self):
    return int(float(self.steps) / 2 / self.time * 60)

  @property
  def doy(self):
    return sum(MONTHS_DAY[:self.month]) + self.day

print 'day of year,steps,miles,time,pace,ppm'
with open('out', 'r') as fp:
  for l in fp:
    r = [s.replace(',', '') for s in l.split()]
    run = Run(r[0], r[1], r[4], r[5], r[7])
    print ','.join([str(s) for s in [run.doy, run.steps, run.miles, run.time, run.pace, run.ppm]])

