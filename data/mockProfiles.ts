import { UserProfile } from '../types';

export const mockProfiles: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    salivaPH: 7.2,
    geneticRisk: 'Medium',
    bruxism: 'Mild',
    lifestyle: 'Active, but high-stress job.',
    goals: 'Reduce inflammation and improve gum health.',
  },
  {
    id: 'user-2',
    name: 'Samantha Lee',
    salivaPH: 6.8,
    geneticRisk: 'High',
    bruxism: 'Moderate',
    lifestyle: 'Busy parent, often skips night brushing.',
    goals: 'Prevent cavities and strengthen enamel.',
  },
  {
    id: 'user-3',
    name: 'Ben Carter',
    salivaPH: 7.5,
    geneticRisk: 'Low',
    bruxism: 'None',
    lifestyle: 'Athlete, high sugar sports drinks.',
    goals: 'Optimize performance and longevity, maintain smile.',
  }
];
