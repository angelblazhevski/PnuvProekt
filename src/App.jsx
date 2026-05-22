import { useState, useEffect } from 'react';

// Податоци за 3 различни аватари (диференцијација)
const AVATARS = {
    ana: {
        id: "ana",
        name: "Ана",
        age: "13 години",
        desc: "Ана поминува премногу време на социјалните мрежи (TikTok/Instagram) и често се соочува со лош сон и дигитална заситеност.",
        defaultSleep: 6.5,
        defaultScreen: 7,
        defaultExercise: 1,
        defaultPressure: 4,
        avatarFace: "👩‍🎨",
        focusTopic: "screenTime"
    },
    marko: {
        id: "marko",
        name: "Марко",
        age: "15 години",
        desc: "Марко е под силен притисок од родителите и училиштето за високи оценки, но се труди да одржува баланс преку спорт.",
        defaultSleep: 8,
        defaultScreen: 3,
        defaultExercise: 4,
        defaultPressure: 8,
        avatarFace: "🏃‍♂️",
        focusTopic: "schoolPressure"
    },
    luka: {
        id: "luka",
        name: "Лука",
        age: "11 години",
        desc: "Лука е пасивен гејмер кој ги поминува викендите пред компјутер. Има многу ниска физичка активност.",
        defaultSleep: 7,
        defaultScreen: 6,
        defaultExercise: 0,
        defaultPressure: 3,
        avatarFace: "🎮",
        focusTopic: "physicalActivity"
    }
};

const HBSC_MCD_DATA = {
    sleep: {
        title: "Недостаток на сон",
        desc: "Процентот на млади во Македонија кои спијат помалку од препорачаните 8 часа на училишни денови поради користење на телефони навечер.",
        labels: ["11 години", "13 години", "15 години"],
        boys: [25, 38, 52],
        girls: [31, 46, 61],
        metric: "% спијат под препорачаното"
    },
    screenTime: {
        title: "Време пред екран (Над 4 часа)",
        desc: "Процентот на ученици кои поминуваат прекумерно време на социјални мрежи и видео игри во текот на работната недела.",
        labels: ["11 години", "13 години", "15 години"],
        boys: [42, 58, 69],
        girls: [38, 62, 73],
        metric: "% со прекумерно време"
    },
    schoolPressure: {
        title: "Чувство на училишен притисок",
        desc: "Процентот на ученици кои пријавуваат високо ниво на стрес и притисок од училишните обврски и очекувања во Македонија.",
        labels: ["11 години", "13 години", "15 години"],
        boys: [18, 29, 41],
        girls: [22, 45, 62],
        metric: "% под силен притисок"
    },
    physicalActivity: {
        title: "Физичка активност (60 мин)",
        desc: "Очекуваниот стандард од 60 минути умерена до силна физичка активност секој ден се исполнува од загрижувачки мал број млади.",
        labels: ["11 години", "13 години", "15 години"],
        boys: [35, 28, 22],
        girls: [24, 16, 11],
        metric: "% кои ги исполнуваат препораките"
    }
};

const QUIZ_QUESTIONS = [
    {
        question: "Кој процент од 15-годишните девојчиња во Македонија пријавуваат силен училишен притисок според HBSC?",
        options: ["20% од девојчињата", "42% од девојчињата", "62% од девојчињата", "85% од девојчињата"],
        correct: 2,
        fact: "Дури 62% од 15-годишните девојчиња во Македонија пријавуваат силен училишен притисок, што е драстично повисоко споредено со нивните машки врсници (41%)."
    },
    {
        question: "Колку проценти од 15-годишните девојчиња во нашата земја ги исполнуваат препораките за 60 минути физичка активност дневно?",
        options: ["Само 11%", "Околу 35%", "Половината (50%)", "Над 75%"],
        correct: 0,
        fact: "Само 11% од 15-годишните девојчиња во Македонија вежбаат барем еден час на ден, што претставува алармантно ниско ниво на движење со возраста."
    },
    {
        question: "Што се смета за најсилен заштитен фактор (социјален контекст) против депресивно расположение кај младите?",
        options: ["Прекумерна дигитална забава", "Силна поддршка од семејството", "Голем број виртуелни следбеници", "Чести патувања и шопинг"],
        correct: 1,
        fact: "Истражувањата на HBSC докажуваат дека стабилната поддршка и комуникација во семејството е најсилниот штит против анксиозност кај тинејџерите."
    },
    {
        question: "Колкав процент од македонските 15-годишници пријавуваат проблеми со спиењето поради ноќно скролање на социјалните мрежи?",
        options: ["Помалку од 15%", "Околу 30%", "Над 50%", "Сите 100%"],
        correct: 2,
        fact: "Над 50% од 15-годишниците (52% момчиња и 61% девојчиња) спијат помалку од препорачаното бидејќи остануваат активни на социјалните мрежи во доцните ноќни часови."
    }
];

const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'correct') {
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'success') {
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                const singleOsc = ctx.createOscillator();
                const singleGain = ctx.createGain();
                singleOsc.connect(singleGain);
                singleGain.connect(ctx.destination);
                singleOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
                singleGain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
                singleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.25);
                singleOsc.start(ctx.currentTime + idx * 0.1);
                singleOsc.stop(ctx.currentTime + idx * 0.1 + 0.3);
            });
        }
    } catch (e) {
        console.log("Audio API not supported.");
    }
};

export default function App() {
    const [activeTab, setActiveTab] = useState('simulator');

    // Менаџирање со селектиран Аватар
    const [selectedAvatarKey, setSelectedAvatarKey] = useState('ana');
    const currentAvatar = AVATARS[selectedAvatarKey];

    // Контроли за симулаторот кои се ресетираат на промена на аватар
    const [sleep, setSleep] = useState(currentAvatar.defaultSleep);
    const [screentime, setScreentime] = useState(currentAvatar.defaultScreen);
    const [exercise, setExercise] = useState(currentAvatar.defaultExercise);
    const [pressure, setPressure] = useState(currentAvatar.defaultPressure);

    // Бонуси
    const [questSleep, setQuestSleep] = useState(false);
    const [questHydration, setQuestHydration] = useState(false);
    const [questStretch, setQuestStretch] = useState(false);

    // Извештај име на студент
    const [studentName, setStudentName] = useState('');
    const [showReport, setShowReport] = useState(false);

    // Следење на промена на аватарот
    useEffect(() => {
        setSleep(currentAvatar.defaultSleep);
        setScreentime(currentAvatar.defaultScreen);
        setExercise(currentAvatar.defaultExercise);
        setPressure(currentAvatar.defaultPressure);
        setQuestSleep(false);
        setQuestHydration(false);
        setQuestStretch(false);
        setShowReport(false);
    }, [selectedAvatarKey]);

    // Пресметка на 24-часовен дневен буџет
    const fixedSchoolStudyHours = Math.round(6 + (pressure * 0.5));
    const freeTimeHours = Math.max(0, Math.round(24 - sleep - screentime - (exercise * 0.5) - fixedSchoolStudyHours));
    const totalHoursUsed = sleep + screentime + (exercise * 0.5) + fixedSchoolStudyHours;
    const isTimeOverbudget = totalHoursUsed > 24;

    // Здравствени пресметки (формули во реално време)
    const [outcomes, setOutcomes] = useState({
        stress: 50,
        mental: 50,
        fitness: 50,
        social: 50,
        mood: 'good'
    });

    useEffect(() => {
        const sleepBonus = questSleep ? 1.5 : 0;
        const hydrationBonus = questHydration ? 12 : 0;
        const stretchBonus = questStretch ? 10 : 0;

        const finalSleep = Math.min(11, sleep + sleepBonus);

        const calculatedStress = Math.min(100, Math.max(5,
            Math.round((pressure * 6.5) + (screentime * 5) - (finalSleep * 4) + 15)
        ));

        const calculatedMental = Math.min(100, Math.max(5,
            Math.round((finalSleep * 6.5) + (exercise * 4) - (screentime * 5) - (pressure * 2.5) + 35 + hydrationBonus)
        ));

        const calculatedFitness = Math.min(100, Math.max(5,
            Math.round((exercise * 9.5) + (finalSleep * 2) - (screentime * 1.5) + 10 + stretchBonus)
        ));

        const calculatedSocial = Math.min(100, Math.max(5,
            Math.round((calculatedMental * 0.45) + (calculatedFitness * 0.25) + (finalSleep * 1.5) + freeTimeHours * 1.5 + 5)
        ));

        // Интелигентно менување на аватарот во однос на карактерите
        let mood = 'good';
        if (calculatedStress > 70 || calculatedMental < 40) {
            mood = 'critical_stress';
        } else if (finalSleep < 7.5 || calculatedMental < 52) {
            mood = 'tired';
        } else if (exercise < 2) {
            mood = 'unactive';
        }

        setOutcomes({
            stress: calculatedStress,
            mental: calculatedMental,
            fitness: calculatedFitness,
            social: calculatedSocial,
            mood: mood
        });
    }, [sleep, screentime, exercise, pressure, questSleep, questHydration, questStretch, freeTimeHours]);

    // ДИГИТАЛЕН DASHBOARD
    const [selectedTopic, setSelectedTopic] = useState('schoolPressure');
    const dataSet = HBSC_MCD_DATA[selectedTopic];

    // КВИЗ Држави/Митови
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const handleAnswer = (optionIdx) => {
        if (showFeedback) return;
        setSelectedOption(optionIdx);
        setShowFeedback(true);
        if (optionIdx === QUIZ_QUESTIONS[currentQuestion].correct) {
            setScore(score + 10);
            playSound('correct');
        } else {
            playSound('wrong');
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowFeedback(false);
        if (currentQuestion + 1 < QUIZ_QUESTIONS.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizFinished(true);
            playSound('success');
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setScore(0);
        setQuizFinished(false);
    };

    // Метод за извоз на план
    const triggerPrint = () => {
        window.print();
    };

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between font-sans selection:bg-indigo-500/30 text-left w-full overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex-grow space-y-6 print:p-0 overflow-x-hidden">

                {/* Хедер за печатење (скриен во прелистувач) */}
                <div className="hidden print:block text-slate-900 p-6 border-b-2 border-slate-300">
                    <h1 className="text-3xl font-extrabold">HBSC Здравствен Акционен Извештај</h1>
                    <p className="text-sm mt-1">Изработил студент: {studentName || "Анонимен Студент"}</p>
                    <p className="text-xs text-slate-500">Генерирано на: {new Date().toLocaleDateString('mk-MK')}</p>
                </div>

                {/* Главен Хедер */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden w-full text-left print:hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
                    <div className="text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3 flex items-center gap-3 text-left">
                            <span className="text-4xl drop-shadow-md">🎒</span> HBSC Дигитален Wellbeing Центар
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed text-left">
                            Софтверски симулатор на здравје со интелигентен буџет на времето и акциони планови за младите во Македонија.
                        </p>
                    </div>
                </div>

                {/* Распоред со картички */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full print:block">

                    {/* Лева колона: Сидбар и Избор на Аватари (Скриено при печатење) */}
                    <div className="lg:col-span-1 space-y-6 w-full text-left print:hidden">

                        {/* Навигациско Мени */}
                        <div className="flex flex-col gap-2.5 w-full">
                            {[
                                { id: 'simulator', label: 'Симулатор на здравје', icon: 'fa-gamepad', color: 'bg-indigo-600' },
                                { id: 'dashboard', label: 'HBSC Статистика', icon: 'fa-chart-bar', color: 'bg-cyan-600' },
                                { id: 'quiz', label: 'Едукативен Квиз', icon: 'fa-lightbulb', color: 'bg-purple-600' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95 cursor-pointer border justify-start ${
                                        activeTab === item.id
                                            ? `${item.color} text-white border-transparent shadow-xl`
                                            : 'bg-slate-800/80 hover:bg-slate-700/60 text-slate-400 hover:text-white border-slate-700/50'
                                    }`}
                                >
                                    <i className={`fa-solid ${item.icon} text-base w-5 text-center`}></i>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Избор на Аватари (Уникатна карактеристика) */}
                        {activeTab === 'simulator' && (
                            <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-4">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Избери Тинејџер:</span>
                                <div className="flex flex-col gap-2">
                                    {Object.keys(AVATARS).map((key) => {
                                        const active = selectedAvatarKey === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedAvatarKey(key)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left justify-start cursor-pointer ${
                                                    active
                                                        ? 'bg-slate-800 border-indigo-500 text-white shadow-md'
                                                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                                                }`}
                                            >
                                                <span className="text-2xl">{AVATARS[key].avatarFace}</span>
                                                <div>
                                                    <span className="block text-xs font-black">{AVATARS[key].name} ({AVATARS[key].age})</span>
                                                    <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{AVATARS[key].desc}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Десна содржина */}
                    <div className="lg:col-span-3 space-y-6 w-full text-left print:w-full">

                        {/* ТАБ 1: СИМУЛАТОР НА ЗДРАВЈЕ */}
                        {activeTab === 'simulator' && (
                            <div className="space-y-6 w-full text-left">

                                {/* Врвен Информатор за Избраниот Карактер (Printable) */}
                                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-5 w-full print:bg-white print:border-slate-300 print:text-slate-900">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center text-3xl shrink-0 select-none">
                                        {currentAvatar.avatarFace}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-white print:text-slate-900">Приказна на {currentAvatar.name} ({currentAvatar.age})</h3>
                                        <p className="text-slate-400 text-xs mt-1 leading-relaxed print:text-slate-600">
                                            {currentAvatar.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Главни Слајдери со Калкулатор на Буџет */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full print:hidden">

                                    {/* Лево: Контролен Панел */}
                                    <div className="xl:col-span-2 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 w-full">
                                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                            <div>
                                                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                                                    <i className="fa-solid fa-sliders text-indigo-400"></i>
                                                    Дневни Навики
                                                </h2>
                                            </div>

                                            {/* Буџет Индикатор */}
                                            <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full border ${
                                                isTimeOverbudget
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                            }`}>
                        🕒 Вкупно: {totalHoursUsed}ч / 24ч
                      </span>
                                        </div>

                                        {isTimeOverbudget && (
                                            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                                                <span>⚠️</span>
                                                <span><strong>Денот има само 24 часа!</strong> Намали ги социјалните мрежи или сонот за да ги порамниш активностите.</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Спиење */}
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-300">💤 Спиење</span>
                                                    <span className="bg-indigo-500/15 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/20">{sleep} часа</span>
                                                </div>
                                                <input
                                                    type="range" min="4" max="11" step="0.5" value={sleep}
                                                    onChange={(e) => setSleep(parseFloat(e.target.value))}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                />
                                            </div>

                                            {/* Екранско */}
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-300">📱 Социјални мрежи</span>
                                                    <span className="bg-cyan-500/15 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded border border-cyan-500/20">{screentime} часа</span>
                                                </div>
                                                <input
                                                    type="range" min="1" max="12" step="0.5" value={screentime}
                                                    onChange={(e) => setScreentime(parseFloat(e.target.value))}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                                />
                                            </div>

                                            {/* Вежбање */}
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-300">🏃 Спорт & активност</span>
                                                    <span className="bg-emerald-500/15 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/20">{exercise} дена</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="7" step="1" value={exercise}
                                                    onChange={(e) => setExercise(parseInt(e.target.value))}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                />
                                            </div>

                                            {/* Притисок */}
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-300">📚 Училишен притисок</span>
                                                    <span className="bg-rose-500/15 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded border border-rose-500/20">Ниво {pressure}/10</span>
                                                </div>
                                                <input
                                                    type="range" min="1" max="10" step="1" value={pressure}
                                                    onChange={(e) => setPressure(parseInt(e.target.value))}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Десно: Челенџи и слободно време */}
                                    <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                                        <div className="space-y-3">
                                            <span className="text-xs font-black text-slate-400 block uppercase tracking-wider">Дневен Буџет Анализа</span>

                                            <div className="space-y-2 text-xs text-slate-300">
                                                <div className="flex justify-between">
                                                    <span>🏫 Училишни часови:</span>
                                                    <span className="font-bold text-slate-100">{fixedSchoolStudyHours}ч</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>🧸 Слободно време:</span>
                                                    <span className={`font-bold ${freeTimeHours < 2 ? 'text-rose-400' : 'text-emerald-400'}`}>{freeTimeHours}ч</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Челенџ кутија */}
                                        <div className="space-y-2 border-t border-slate-800 pt-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Дневна мисија</span>
                                            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800 hover:border-indigo-500/20 transition-all cursor-pointer">
                                                <input
                                                    type="checkbox" checked={questSleep}
                                                    onChange={(e) => setQuestSleep(e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
                                                />
                                                <div className="text-left">
                                                    <span className="block text-[10px] font-bold text-slate-200">Исклучи уреди пред сон</span>
                                                    <span className="text-[9px] text-indigo-300 font-semibold block">+1.5ч поквалитетен сон</span>
                                                </div>
                                            </label>

                                            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800 hover:border-indigo-500/20 transition-all cursor-pointer">
                                                <input
                                                    type="checkbox" checked={questHydration}
                                                    onChange={(e) => setQuestHydration(e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
                                                />
                                                <div className="text-left">
                                                    <span className="block text-[10px] font-bold text-slate-200">Пиј 2L вода на ден</span>
                                                    <span className="text-[9px] text-emerald-300 font-semibold block">+12% ментален фокус</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Гаужи / Здравствени Фактори */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full print:grid-cols-4">
                                    {[
                                        { title: "Училишен Стрес", value: outcomes.stress, color: "#f43f5e", bg: "bg-rose-500/10", text: "text-rose-400", desc: outcomes.stress > 70 ? "🚨 Висок притисок" : outcomes.stress > 40 ? "⚖️ Умерен стрес" : "✅ Низок стрес" },
                                        { title: "Ментално Здравје", value: outcomes.mental, color: "#a855f7", bg: "bg-purple-500/10", text: "text-purple-400", desc: outcomes.mental > 75 ? "⭐ Извонредно" : outcomes.mental > 45 ? "🧘 Стабилно" : "⚠️ Иритираност" },
                                        { title: "Физички Фокус", value: outcomes.fitness, color: "#10b981", bg: "bg-emerald-500/10", text: "text-emerald-400", desc: outcomes.fitness > 70 ? "💪 Во форма" : outcomes.fitness > 40 ? "🏃 Умерен фокус" : "🛋️ Неактивен" },
                                        { title: "Индекс на среќа", value: outcomes.social, color: "#06b6d4", bg: "bg-cyan-500/10", text: "text-cyan-400", desc: outcomes.social > 70 ? "😊 Исполнет" : outcomes.social > 40 ? "😐 Солиден баланс" : "😔 Осаменост" }
                                    ].map((g) => (
                                        <div key={g.title} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center print:bg-white print:border-slate-300 print:text-slate-900">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 print:text-slate-600">{g.title}</span>
                                            <div className="relative flex items-center justify-center w-20 h-20">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                                                    <circle cx="40" cy="40" r="32" stroke={g.color} strokeWidth="6" fill="transparent"
                                                            strokeDasharray={2 * Math.PI * 32}
                                                            strokeDashoffset={2 * Math.PI * 32 * (1 - g.value / 100)}
                                                            strokeLinecap="round" className="transition-all duration-700 ease-out" />
                                                </svg>
                                                <span className="absolute text-sm font-black text-white print:text-slate-900">{g.value}%</span>
                                            </div>
                                            <span className={`mt-3 text-[10px] font-black px-2 py-0.5 rounded-full ${g.bg} ${g.text} border border-transparent print:bg-transparent print:border-slate-200`}>
                        {g.desc}
                      </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Ексклузивен Акционен Извештај (Custom PDF Planner) */}
                                <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-indigo-500/15 space-y-4 w-full print:bg-white print:border-slate-300 print:text-slate-900">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-lg font-black text-white flex items-center gap-2 print:text-slate-900">
                                                <span className="text-xl">📋</span>
                                                Здравствен План за {currentAvatar.name}
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-0.5 print:text-slate-600">
                                                Внеси го твоето име за да го персонализираш овој извештај инспириран од HBSC податоците во Македонија.
                                            </p>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto print:hidden">
                                            <input
                                                type="text"
                                                placeholder="Твоето Име"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-full md:w-44"
                                            />
                                            <button
                                                onClick={triggerPrint}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-lg shadow-indigo-500/20"
                                            >
                                                <i className="fa-solid fa-print mr-1.5"></i>
                                                Печати Извештај
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 space-y-3 text-xs leading-relaxed text-slate-300 print:bg-transparent print:border-slate-200 print:text-slate-900">
                                        <p className="font-bold text-slate-100 print:text-slate-900">Оценка на дигиталната рамнотежа:</p>
                                        <ul className="space-y-2 list-disc pl-4 text-slate-400 print:text-slate-800">
                                            <li>Притисок во денот: <strong className="text-slate-200 print:text-slate-900">{totalHoursUsed} часа</strong> искористени за активни обврски.</li>
                                            <li>
                                                {sleep < 8 ? (
                                                    <span className="text-rose-300 print:text-rose-700">⚠️ Критичен недостаток на сон! Моменталниот сон изнесува само {sleep} часа што ја намалува концентрацијата и го дуплира утринскиот стрес во училиште.</span>
                                                ) : (
                                                    <span className="text-emerald-300 print:text-emerald-700">✅ Одличен квалитет на спиење. Моменталните {sleep} часа му даваат простор на умот за соодветно регенерирање.</span>
                                                )}
                                            </li>
                                            <li>
                                                {screentime > 5 ? (
                                                    <span className="text-rose-300 print:text-rose-700">⚠️ Интензивно користење социјални мрежи. На над {screentime} часа пред екрани, веројатноста од анксиозност се зголемува за 35% според студиите на HBSC Македонија.</span>
                                                ) : (
                                                    <span className="text-emerald-300 print:text-emerald-700">✅ Контролирано време пред екран. Твојот аватар ужива безбеден и корисен дигитален живот.</span>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ТАБ 2: HBSC ДИГИТАЛЕН DASHBOARD */}
                        {activeTab === 'dashboard' && (
                            <div className="bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 animate-fadeIn w-full text-left">
                                <div className="border-b border-slate-800 pb-5 w-full text-left space-y-3">
                                    <div className="text-left">
                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5 text-left">
                                            <i className="fa-solid fa-chart-line text-cyan-400"></i>
                                            HBSC Македонија - Истражувачки Податоци
                                        </h2>
                                        <p className="text-slate-400 text-xs mt-1 text-left">
                                            Интерактивна и визуелно чиста споредба на анкетираните ученици во Македонија по пол и возраст.
                                        </p>
                                    </div>

                                    {/* Селектор */}
                                    <div className="flex flex-wrap gap-2 w-full">
                                        {Object.keys(HBSC_MCD_DATA).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedTopic(key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer border ${
                                                    selectedTopic === key
                                                        ? 'bg-cyan-500 text-slate-950 border-transparent shadow-lg shadow-cyan-500/10'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700/60'
                                                }`}
                                            >
                                                {HBSC_MCD_DATA[key].title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex gap-4 text-sm leading-relaxed text-slate-300 w-full text-left">
                                    <div className="text-2xl shrink-0">ℹ️</div>
                                    <p className="text-left">
                                        <strong className="text-white">Што покажува овој индикатор?</strong> {dataSet.desc}
                                    </p>
                                </div>

                                {/* Графикони */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full text-left">
                                    <div className="xl:col-span-2 bg-slate-950/40 p-6 rounded-2xl border border-slate-800 space-y-6 w-full text-left">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-left">Споредба на одговори по возраст и пол во Македонија</h3>

                                        {dataSet.labels.map((ageGroup, idx) => (
                                            <div key={ageGroup} className="space-y-3 bg-slate-950/20 p-4 rounded-xl border border-slate-900 w-full text-left">
                                                <span className="text-sm font-black text-slate-300 block text-left">{ageGroup}</span>

                                                <div className="space-y-2.5 w-full">
                                                    {/* Момчиња */}
                                                    <div className="flex items-center gap-3 w-full">
                                                        <span className="w-20 text-xs text-slate-500 text-right shrink-0">👨 Момчиња</span>
                                                        <div className="flex-grow bg-slate-800/80 h-5 rounded-full overflow-hidden relative border border-slate-700/20">
                                                            <div
                                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                                style={{ width: `${dataSet.boys[idx]}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-12 text-xs font-black text-cyan-400 text-right shrink-0">
                              {dataSet.boys[idx]}%
                            </span>
                                                    </div>

                                                    {/* Девојчиња */}
                                                    <div className="flex items-center gap-3 w-full">
                                                        <span className="w-20 text-xs text-slate-500 text-right shrink-0">👩 Девојчиња</span>
                                                        <div className="flex-grow bg-slate-800/80 h-5 rounded-full overflow-hidden relative border border-slate-700/20">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                                style={{ width: `${dataSet.girls[idx]}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-12 text-xs font-black text-purple-400 text-right shrink-0">
                              {dataSet.girls[idx]}%
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 w-full text-left">
                                        <div className="text-left">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-left">Најважни Заклучоци</h3>
                                            <ul className="space-y-4 text-xs text-slate-300 leading-relaxed text-left">
                                                <li className="flex gap-2 items-start text-left">
                                                    <span className="text-purple-400 font-bold shrink-0">•</span>
                                                    <span>
                            <strong>Родови разлики со возраста:</strong> Девојчињата со возраста пријавуваат значително поголеми проблеми кај квалитетот на сонот и училишниот притисок.
                          </span>
                                                </li>
                                                <li className="flex gap-2 items-start text-left">
                                                    <span className="text-cyan-400 font-bold shrink-0">•</span>
                                                    <span>
                            <strong>Време на екрани:</strong> Повеќе од половина од македонските 15-годишници спијат недоволно поради интензивно ноќно скролање на телефони.
                          </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed text-left">
                                            Податоци од официјалните национални извештаи на <a href="https://www.mkhbsc.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300 transition-colors inline-block">MK HBSC Platform</a>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ТАБ 3: ЕДУКАТИВЕН КВИЗ */}
                        {activeTab === 'quiz' && (
                            <div className="max-w-2xl mx-auto animate-fadeIn w-full text-left">
                                <div className="bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 w-full text-left">

                                    <div className="flex justify-between items-center border-b border-slate-800 pb-4 w-full text-left">
                                        <div className="flex items-center gap-2.5 text-left">
                                            <i className="fa-solid fa-brain text-purple-400 text-xl animate-pulse"></i>
                                            <h2 className="text-2xl font-extrabold text-white text-left">HBSC Митови наспроти Факти</h2>
                                        </div>
                                        <span className="text-xs font-black bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/20 shadow-sm shrink-0">
                      Поени: {score}
                    </span>
                                    </div>

                                    {!quizFinished ? (
                                        <div className="space-y-6 w-full text-left">
                                            <div className="space-y-1 w-full text-left">
                                                <div className="flex justify-between text-xs text-slate-500 font-bold w-full">
                                                    <span>ПРАШАЊЕ {currentQuestion + 1} ОД {QUIZ_QUESTIONS.length}</span>
                                                    <span>{Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500 ease-out"
                                                        style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed text-left">
                                                {QUIZ_QUESTIONS[currentQuestion].question}
                                            </h3>

                                            <div className="grid grid-cols-1 gap-3.5 w-full text-left">
                                                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => {
                                                    let buttonStyle = "bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:scale-[1.01]";

                                                    if (showFeedback) {
                                                        if (idx === QUIZ_QUESTIONS[currentQuestion].correct) {
                                                            buttonStyle = "bg-emerald-950/50 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/5 scale-[1.01]";
                                                        } else if (idx === selectedOption) {
                                                            buttonStyle = "bg-rose-950/50 text-rose-400 border-rose-500/50 shadow-lg shadow-rose-500/5 scale-[1.01]";
                                                        } else {
                                                            buttonStyle = "opacity-40 bg-slate-950/20 text-slate-600 border-slate-900";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={idx}
                                                            disabled={showFeedback}
                                                            onClick={() => handleAnswer(idx)}
                                                            className={`w-full text-left p-4 rounded-2xl border font-bold text-sm transition-all duration-300 transform cursor-pointer flex justify-between items-center ${buttonStyle}`}
                                                        >
                                                            <span>{option}</span>
                                                            {showFeedback && idx === QUIZ_QUESTIONS[currentQuestion].correct && (
                                                                <span className="text-emerald-400 shrink-0 ml-2">✓</span>
                                                            )}
                                                            {showFeedback && idx === selectedOption && idx !== QUIZ_QUESTIONS[currentQuestion].correct && (
                                                                <span className="text-rose-400 shrink-0 ml-2">✗</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {showFeedback && (
                                                <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/20 space-y-3 animate-slideIn w-full text-left">
                                                    <h4 className="font-extrabold text-xs text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 text-left">
                                                        💡 Знаеш ли дека? (HBSC Научен Факт)
                                                    </h4>
                                                    <p className="text-slate-300 text-sm leading-relaxed italic text-left">
                                                        "{QUIZ_QUESTIONS[currentQuestion].fact}"
                                                    </p>
                                                    <button
                                                        onClick={handleNext}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-indigo-500/20 text-sm block text-center"
                                                    >
                                                        {currentQuestion + 1 === QUIZ_QUESTIONS.length ? "Краен Резултат" : "Следно Прашање"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 space-y-6 w-full">
                                            <div className="text-6xl animate-bounce">🏆</div>
                                            <h3 className="text-2xl font-black text-white text-center">Квизот е успешно завршен!</h3>
                                            <p className="text-slate-300 max-w-sm mx-auto text-sm leading-relaxed text-center">
                                                Твојот резултат е <strong className="text-emerald-400">{score}</strong> од 40 поени. Со ова веќе придонесуваш за подобар фокус кон младинската благосостојба во Македонија!
                                            </p>
                                            <button
                                                onClick={restartQuiz}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 cursor-pointer shadow-xl shadow-indigo-500/20 text-sm inline-block"
                                            >
                                                Обиди се повторно
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="w-full text-center py-5 text-xs text-slate-500 border-t border-slate-900 bg-slate-950 block print:hidden">
                &copy; {new Date().getFullYear()} Ангел Блажевски - Дигитално едукативно решение за младинска благосостојба во Македонија.
            </footer>
        </div>
    );
}