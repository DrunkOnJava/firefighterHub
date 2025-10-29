Q&A: Firefighter Hold Process

#### **General Question**
1. **What does "hold" mean in fire department terminology? Is it:**  
   A) Being held at another station to cover their shift  
   B) Being unavailable/off-duty  
   C) Something else?  
   - **Answer:** C. A "hold" means that member must stay at work the following day from their regular shift to fill a vacancy. The member may not stay at their assigned station for the hold. Their station assignment for the hold is based on where the vacancy is.

---

#### **Quick Yes/No Questions**
2. **When a firefighter is "held," does that mean they are unavailable to work their normal shift (they're being used elsewhere)?**  
   - **Answer:** No. The member works their normal shift. They are held over for 12 or 24 hours on another shift to fill the vacancy.

3. **Does "completing a hold" mean the firefighter has finished being held and is now back available for rotation?**  
   - **Answer:** Yes. "Completing a hold" means the member has finished their mandatory hold and is moved to the bottom of the rotation.

4. **Should the person at position #0 (top of the list) be the next person to be held?**  
   - **Answer:** Yes. The member in position #0, or position 1 as seen on the rotation, should be next one to be held.

5. **After someone completes a hold, do they go to the bottom/last position in the rotation so everyone else moves up?**  
   - **Answer:** Yes. When a member completes a hold, they move to the bottom of the rotation.

6. **Does last_hold_date track when they were most recently held (not when they last worked)?**  
   - **Answer:** Yes. The last_hold_date tracks when a member is held, not their regularly scheduled shift.

---

#### **Rotation & Fairness**
7. **Are any members exempt from holds (rank, probation, medical, training)?**  
   - **Answer:** Yes. A member may be "skipped" for training or other schedule conflicts on a case-by-case basis.

8. **If the #0 member is ineligible today, do we pick #1 (and leave #0 in place), or skip and push #0 to bottom?**  
   - **Answer:** If the #0 member is ineligible today, the memeber in the #1 position is held. That member moves to the bottom of the rotation while the member in the #0 position remains at the top of the list.

9. **Do new hires start at the bottom by default?**  
   - **Answer:** Yes. At default, new hires will start at the bottom of the list. The battalion chief may manually move them on the list as they see fit.

10. **Any tie-breaker beyond list order (e.g., seniority, least recent hold date)?**  
    - **Answer:** No. There are no tie-breakers.

---

#### **Durations & Rest**
11. **Exact start time for a 12h hold and a 24h hold?**  
    - **Answer:** The start time for a hold is 07:00 at default. Although the member in the #0 position is subject to being called back into work if a vacancy occurs in the middle of the shift.

12. **Any minimum rest requirement between a regular shift and a hold (or between holds)?**  
    - **Answer:** If a member has worked more than 72 hours prior to the hold date or the hold would make them exceed 72 hours, they are skipped. That member remains in the #0 position.

13. **Max holds per pay period or per week?**  
    - **Answer:** There are no limitations on the number of holds per day. If there is a vacancy in the schedule, it must be filled by a hold if the shift is not voluntarily signed up for.

---

#### **Stations & Overrides**
14. **When a vacancy exists, is the rule strictly vacancy-station or can a supervisor assign a different station?**  
    - **Answer:** No. The battalion chief can and will reassign members who are held based on the needs for that day.

15. **Should the UI display the hold station instead of the member's home station (default says "yes")?**  
    - **Answer:** Yes. The UI should display the hold station and not the member's home station.

---

#### **Holidays & Special Days**
16. **Any holiday exceptions or weighting differences (extra pay is payroll, but do rules change who goes next)?**  
    - **Answer:** No. There are no holiday exemptions. Although it at the discretion of the battalion chief to select a member outside of the rotation. Example: if the members in position #0 and #1 are EMTs, but the vacancy is for a paramedic, the battalion chief may choose to hold the member in the #3 position because they are a paramedic. This is on a case-by-case basis.

---

#### **Cancellations & Edits**
17. **If a hold is canceled before it starts, does the member still move to bottom?**  
    - **Answer:** If a hold is canceled before it starts, the member remains at the top of the list.

18. **After a hold is completed, what fields can be edited (duration, station, times)? Any lock window?**  
    - **Answer:** After a hold is completed, the station assigned for the hold may be changed. The hold time is not relevant to show because that is managed through the department's scheduling program. The hold can be locked after 1 week from the original submission.

---

#### **Notifications**
19. **Preferred lead time and reminder schedule (e.g., 18h lead, reminders at 12h and 4h)?**  
    - **Answer:** Lead times are not consistent. If a vacancy arises in the middle of the day, the member in the #0 position may not have any previous notice. Although, the on duty battalion chief tries to notify the member up for hold as soon as possible, which is usually before 22:00 the night before the hold date.

20. **Required channels: SMS, email, push?**  
    - **Answer:** SMS, email, or push notifications are acceptable options.

---

#### **Reports**
21. **Which metrics matter: holds per member, average interval between holds, by station, by duration?**  
    - **Answer:** Metrics that matter include: holds per member, average interval between holds, holds per station, and holds were shift.

---

### Simple Rules We Already Know (local defaults)

- A "hold" is worked the day after the member's regular shift, for 12h or 24h.
- Holds can be at a different station; assignment is vacancy-based by default.
- The person at position #0 is next to be held.
- After completing a hold, the member goes to the bottom of the rotation.
- last_hold_date tracks when the member was last held, not when they last worked a regular shift.
- Members still work their normal shift; the hold is additional time.
- **If the person at position #0 is ineligible, the person at position #1 is held, and #1 moves to the bottom of the rotation while #0 stays at the top.**
- **New hires start at the bottom of the rotation by default, but the battalion chief can adjust their position as needed.**
- **Holds start at 07:00 by default, but the member in position #0 may still be called back to fill a vacancy mid-shift.**
- **Members can be skipped for training or other schedule conflicts on a case-by-case basis.**
- **There are no tie-breakers beyond list order.**
- **If a member has worked more than 72 hours prior to the hold date or the hold would make them exceed 72 hours, they are skipped and remain in the #0 position.**
- **There are no limitations on the number of holds per day.**
- **The battalion chief can reassign members who are held based on the needs for that day.**
- **The UI should display the hold station, not the member's home station.**
- **There are no holiday exemptions, but the battalion chief can select a member outside of the rotation on a case-by-case basis (e.g., for certification requirements).**
- **If a hold is canceled before it starts, the member remains at the top of the list.**
- **After a hold is completed, the station assigned for the hold may be changed. The hold can be locked after 1 week from the original submission.**
- **Lead times are not consistent; notification is usually before 22:00 the night before the hold date.**
- **SMS, email, or push notifications are acceptable options.**
- **Key metrics: holds per member, average interval between holds, holds per station, and holds per shift.**