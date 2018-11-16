import {easter} from 'date-easter'
import {getMonth, getDate, getISODay, addDays} from 'date-fns'
import { startCase } from 'lodash-es';

export const isHoliday = date =>
  (getDate(date)==1 && getMonth(date)==1) // Nouvel an
  || (date == addDays(easter(date),1)) // Pâques
  || (getDate(date)==1 && getMonth(date)==5) // Fête du Travail
  || (getDate(date)==8 && getMonth(date)==5) // Fête de la Victoire
  || (date == addDays(easter(date),40)) // Ascension
  // || date == addDays(easter(date),50) // Pentecôte
  || (getDate(date)==14 && getMonth(date)==7) // Fête nationale
  || (getDate(date)==15 && getMonth(date)==8) // Assomption
  || (getDate(date)==1 && getMonth(date)==11) // Toussaint
  || (getDate(date)==11 && getMonth(date)==11) // Armistice 1918
  || (getDate(date)==25 && getMonth(date)==12) // Noël

export const isWeekend = date => getISODay(date) >= 6

export const dayType = date => {
  if (isWeekend(date)) return 'Weekend'
  else if (isHoliday(date)) return 'Holiday'
  else return 'Workday'
}

export const dateRange = (start,end) => {
  const range = []
  for (let cur = start; cur <= end; cur = addDays(cur,1)) {
    range.push(cur)
  }
  return range
}

export const nextBusinessDay = (date) => {
  while (isWeekend(date) || isHoliday(date)) date = addDays(date,1)
  return date
}

export const businessDays = (start,end) =>
  dateRange(start,end).filter(date=>
    !isWeekend(date) && !isHoliday(date)
  )

export const isValidDate = date => date instanceof Date && !isNaN(date)
