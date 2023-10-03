import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import LawyerProfile from '../models/LawyerProfile';
import LawyerProfileForEdit from '../models/LawyerProfileForEdit';
import ScheduleInput from '../models/inputs/ScheduleInput';
import Days from '../constants/daysOfWeek';
import TimeSlotInput from '../models/inputs/TimeSlotInput';

const createProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.createProfile, input);
    
    return res;
}

const editProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.editProfile, input);
    
    return res;
}

const getOwnProfile: () => Promise<LawyerProfile | null> = async () => {
    const res = await requester.get(apiRoutes.ownProfile);
    
    return res;
}

const getOwnProfileDataForEdit: () => Promise<LawyerProfileForEdit> = async () => {
    const res = await requester.get(apiRoutes.ownProfileDataForEdit);
    
    return res;
}

const getProfile: (id: number) => Promise<LawyerProfile | null> = async (id) => {
    const res = await requester.get(`${apiRoutes.profile}/${id}`);
    
    return res;
}

const getAll: (name: string | null, categories: number[], regions: number[]) => Promise<LawyerProfile[]> = async (name, categories, regions) => {
    let path = apiRoutes.allProfiles;
    
    if ((name !== null && name !== '') || categories.length !== 0 || regions.length !== 0) {
        path = `${apiRoutes.allProfiles}?name=${name === null ? '' : name}&categories=${categories.join()}&regions=${regions.join()}`;
    }
   
    const res = await requester.get(path);
    
    return res;
}

const getScheduleForDay = (dayOfWeek: string, schedule: ScheduleInput) => {
    let scheduleForDay = schedule.monday;
    
    switch(dayOfWeek){
      case Days.Monday:
        scheduleForDay = schedule.monday;
        break;
      case Days.Tuesday:
        scheduleForDay = schedule.tuesday;
        break;
      case Days.Wednesday:
        scheduleForDay = schedule.wednesday;
        break;
      case Days.Thursday:
        scheduleForDay = schedule.thursday;
        break;
      case Days.Friday:
        scheduleForDay = schedule.friday;
        break;
      case Days.Saturday:
        scheduleForDay = schedule.saturday;
        break;
      case Days.Sunday:
        scheduleForDay = schedule.sunday;
        break;
    }

    return scheduleForDay;
}

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

        return null;
      }
}

const profileService = {
    createProfile,
    editProfile,
    getOwnProfile,
    getProfile,
    getOwnProfileDataForEdit,
    getAll,
    getScheduleForDay,
    validateTimeSlot,
    validateTimeSlotsInDay
};

export default profileService;