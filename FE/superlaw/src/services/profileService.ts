import TimeSlotInput from '../models/inputs/TimeSlotInput';

const validateTimeSlot = (from: string, to: string) => {
    let fromHours = Number(from.split(':')[0]);
    let fromMinutes = Number(from.split(':')[1]);
    let toHours = Number(to.split(':')[0]);
    let toMinutes = Number(to.split(':')[1]);

    const todayDate = new Date();

    const newFrom = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), fromHours, fromMinutes);
    const newTo = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), toHours, toMinutes);
    
    const newFromTime = newFrom.getTime();
    const newToTime = newTo.getTime();

    //Check if time slot is valid
    if (newFromTime >= newToTime) {
      return 'Началният час не може да е след крайния';
    }

    //Check if from time is valid
    if (fromHours >= 21 || fromHours < 6) {
        return 'Началният час трябва да е между 6 и 21';
      }
  
      //Check if to time is valid
      if (toHours >= 22 || toHours < 6) {
        return 'Крайният час трябва да е между 6 и 22';
      }
      
      const minuteDiffBetweenToAndFrom = Math.abs((newFrom.getMinutes() + (newFrom.getHours() * 60)) - (newTo.getMinutes() + (newTo.getHours() * 60)));
      //Check for minute diffs if its more than 2 hours
      if (minuteDiffBetweenToAndFrom > 120) { 
        return 'Не може да е повече от 2 часа';
      }
  
      //Check for minute diffs if its less than half hour
      if (minuteDiffBetweenToAndFrom < 30) { 
        return 'Не може да е по-малко от половин час';
      }

      return null;
}

const validateTimeSlotsInDay = (from: string, to: string, scheduleForDay: TimeSlotInput[]) => {
    const todayDate = new Date();

    let fromHours = Number(from.split(':')[0]);
    let fromMinutes = Number(from.split(':')[1]);
    let toHours = Number(to.split(':')[0]);
    let toMinutes = Number(to.split(':')[1]);

    const newFrom = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), fromHours, fromMinutes);
    const newTo = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), toHours, toMinutes);

    //Check if the time slots are overllaping with the others
    for (let i = 0; i < scheduleForDay.length;i++) {
        const timeSlot = scheduleForDay[i];
  
        const timeSlotFromHours = Number(timeSlot.from.split(':')[0]);
        const timeSlotFromMinutes = Number(timeSlot.from.split(':')[1]);
  
        const timeSlotToHours = Number(timeSlot.to.split(':')[0]);
        const timeSlotToMinutes = Number(timeSlot.to.split(':')[1]);
  
        const timeSlotFrom = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), timeSlotFromHours, timeSlotFromMinutes);
        const timeSlotTo = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay(), timeSlotToHours, timeSlotToMinutes);
  
        if (timeSlotFrom < newTo && newFrom < timeSlotTo) {
          let msg = `Застъпва се с ${timeSlotFromHours}:${timeSlotFromMinutes}`;
  
          if( timeSlotFromMinutes < 10){
            msg = `Застъпва се с ${timeSlotFromHours}:0${timeSlotFromMinutes}`;
          }
  
          if(timeSlotToMinutes < 10){
            msg += ` - ${timeSlotToHours}:0${timeSlotToMinutes}`
          } else {
            msg += ` - ${timeSlotToHours}:${timeSlotToMinutes}`
          }

          return msg;
        }
    }
    return null;
}

const profileService = {
    validateTimeSlot,
    validateTimeSlotsInDay
};

export default profileService;