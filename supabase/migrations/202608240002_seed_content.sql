begin;

insert into public.skills(id, slug, title, short_description, icon_key, levels, age_availability) values
('money','money','{"en":"Money","ar":"المال"}','{"en":"Practice saving, spending, and planning.","ar":"تدرّب على التوفير والإنفاق والتخطيط."}','wallet',10,array['4-6','7-9','10-12']),
('responsibility','responsibility','{"en":"Responsibility","ar":"المسؤولية"}','{"en":"Follow through and care for shared things.","ar":"التزم بمهامك واعتنِ بالأشياء المشتركة."}','star',10,array['4-6','7-9','10-12']),
('internet-safety','internet-safety','{"en":"Internet Safety","ar":"الأمان على الإنترنت"}','{"en":"Make safer choices online.","ar":"اتخذ قرارات أكثر أمانًا على الإنترنت."}','shield',10,array['4-6','7-9','10-12']),
('emotions','emotions','{"en":"Emotions","ar":"المشاعر"}','{"en":"Notice, name, and manage feelings.","ar":"لاحظ المشاعر وسمّها وتعامل معها."}','heart',10,array['4-6','7-9','10-12']),
('communication','communication','{"en":"Communication","ar":"التواصل"}','{"en":"Speak clearly and listen with care.","ar":"تحدث بوضوح واستمع باهتمام."}','chat',10,array['4-6','7-9','10-12']),
('time-management','time-management','{"en":"Time Management","ar":"إدارة الوقت"}','{"en":"Plan time and choose priorities.","ar":"خطط لوقتك واختر أولوياتك."}','clock',10,array['4-6','7-9','10-12']),
('health','health','{"en":"Health Habits","ar":"العادات الصحية"}','{"en":"Build everyday healthy routines.","ar":"كوّن عادات يومية صحية."}','leaf',10,array['4-6','7-9','10-12']),
('problem-solving','problem-solving','{"en":"Problem Solving","ar":"حل المشكلات"}','{"en":"Pause, explore, and test solutions.","ar":"توقف وفكر وجرّب الحلول."}','puzzle',10,array['4-6','7-9','10-12']),
('social-skills','social-skills','{"en":"Social Skills","ar":"المهارات الاجتماعية"}','{"en":"Cooperate and understand others.","ar":"تعاون وافهم الآخرين."}','people',10,array['4-6','7-9','10-12']),
('independence','independence','{"en":"Independence","ar":"الاعتماد على النفس"}','{"en":"Practice safe, capable independence.","ar":"تدرّب على الاستقلال الآمن."}','compass',10,array['4-6','7-9','10-12'])
on conflict (id) do nothing;

insert into public.missions(id, skill_id, age_bands, difficulty, title, description, estimated_minutes, xp_reward, steps, is_published) values
('money-share-coins','money',array['4-6'],1,'{"en":"Three Coin Jars","ar":"ثلاث حصالات"}','{"en":"Choose how to spend and save six coins.","ar":"اختر كيف تنفق وتوفر ست عملات."}',5,90,'[]',true),
('money-birthday-bike','money',array['7-9'],2,'{"en":"Birthday Money Choice","ar":"قرار هدية عيد الميلاد"}','{"en":"Compare a toy with a bigger saving goal.","ar":"قارن بين لعبة وهدف توفير أكبر."}',5,100,'[]',true),
('money-game-bundle','money',array['10-12'],3,'{"en":"The Limited-Time Bundle","ar":"العرض محدود الوقت"}','{"en":"Notice pressure before spending.","ar":"لاحظ الضغط قبل الإنفاق."}',5,110,'[]',true),
('responsibility-toys','responsibility',array['4-6'],1,'{"en":"Toy Teamwork","ar":"فريق ترتيب الألعاب"}','{"en":"Follow through after play.","ar":"التزم بالترتيب بعد اللعب."}',5,90,'[]',true),
('responsibility-project','responsibility',array['7-9'],2,'{"en":"The Group Project","ar":"المشروع الجماعي"}','{"en":"Remember a promise to your team.","ar":"تذكر وعدك لفريقك."}',5,100,'[]',true),
('responsibility-mistake','responsibility',array['10-12'],3,'{"en":"Own the Mistake","ar":"تحمّل مسؤولية الخطأ"}','{"en":"Respond honestly to a shared mistake.","ar":"تعامل بصدق مع خطأ مشترك."}',5,110,'[]',true),
('safety-stranger-message','internet-safety',array['4-6'],1,'{"en":"A Message From a Stranger","ar":"رسالة من شخص غريب"}','{"en":"Know when to ask a trusted adult.","ar":"اعرف متى تطلب مساعدة شخص بالغ موثوق."}',5,90,'[]',true),
('safety-photo-request','internet-safety',array['7-9'],2,'{"en":"The Photo Request","ar":"طلب الصورة"}','{"en":"Protect private school information.","ar":"احمِ معلومات المدرسة الخاصة."}',5,100,'[]',true),
('safety-free-credits','internet-safety',array['10-12'],3,'{"en":"Free Game Credits?","ar":"رصيد ألعاب مجاني؟"}','{"en":"Spot an unsafe external link.","ar":"اكتشف رابطًا خارجيًا غير آمن."}',5,110,'[]',true),
('emotions-lost-turn','emotions',array['4-6'],1,'{"en":"When a Turn Feels Hard","ar":"عندما يصعب انتظار الدور"}','{"en":"Name and settle a strong feeling.","ar":"سمِّ شعورًا قويًا واهدأ."}',5,90,'[]',true),
('emotions-friend-cancelled','emotions',array['7-9'],2,'{"en":"Plans Changed","ar":"تغيّرت الخطط"}','{"en":"Handle disappointment kindly.","ar":"تعامل مع خيبة الأمل بلطف."}',5,100,'[]',true),
('emotions-feedback','emotions',array['10-12'],3,'{"en":"Feedback Without the Spiral","ar":"التعامل مع الملاحظات"}','{"en":"Separate feedback from self-worth.","ar":"افصل الملاحظات عن قيمتك."}',5,110,'[]',true),
('problem-tall-tower','problem-solving',array['4-6'],1,'{"en":"The Wobbly Tower","ar":"البرج المتمايل"}','{"en":"Test one building change at a time.","ar":"اختبر تغييرًا واحدًا في كل مرة."}',5,90,'[]',true),
('problem-missed-bus','problem-solving',array['7-9'],2,'{"en":"The Missed Bus","ar":"الحافلة الفائتة"}','{"en":"List safe options when plans fail.","ar":"اكتب خيارات آمنة عندما تفشل الخطة."}',5,100,'[]',true),
('problem-team-conflict','problem-solving',array['10-12'],3,'{"en":"Two Ideas, One Deadline","ar":"فكرتان وموعد واحد"}','{"en":"Compare ideas with shared criteria.","ar":"قارن الأفكار بمعايير مشتركة."}',5,110,'[]',true)
on conflict (id) do nothing;

insert into public.badges(id, title, description, icon_key, unlock_rule) values
('smart-saver','{"en":"Smart Saver","ar":"المدخر الذكي"}','{"en":"Complete a Money mission.","ar":"أكمل مهمة عن المال."}','coin','{"type":"skill-missions","skillId":"money","count":1}'),
('digital-defender','{"en":"Digital Defender","ar":"حامي الإنترنت"}','{"en":"Complete an Internet Safety mission.","ar":"أكمل مهمة عن أمان الإنترنت."}','shield','{"type":"skill-missions","skillId":"internet-safety","count":1}'),
('great-teammate','{"en":"Great Teammate","ar":"زميل رائع"}','{"en":"Complete three missions.","ar":"أكمل ثلاث مهمات."}','people','{"type":"total-missions","count":3}'),
('problem-solver','{"en":"Problem Solver","ar":"حلّال المشكلات"}','{"en":"Complete a Problem Solving mission.","ar":"أكمل مهمة في حل المشكلات."}','puzzle','{"type":"skill-missions","skillId":"problem-solving","count":1}'),
('responsibility-star','{"en":"Responsibility Star","ar":"نجم المسؤولية"}','{"en":"Complete a Responsibility mission.","ar":"أكمل مهمة عن المسؤولية."}','star','{"type":"skill-missions","skillId":"responsibility","count":1}')
on conflict (id) do nothing;

commit;
