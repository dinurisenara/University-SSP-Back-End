const mongoose = require('mongoose');
const Course = require('./../models/Course');
const AcademicYear = require('./../models/AcademicYear');
const Semester = require('./../models/Semester');
const Module = require('./../models/Module');



const seedDatabase = async () => {

    const mongoURI = "mongodb+srv://ADMIN:r0u9JkZG27pY3FJm@university-portal.kd2tgzq.mongodb.net/universityDB?retryWrites=true&w=majority";

    await mongoose.connect(
        mongoURI, 
         { useNewUrlParser: true, useUnifiedTopology: true });


    //Create Courses 

    const courses = [
        {
            courseId: 'SE',
            courseName: 'Software Engineering',
            description: 'A course on Software Engineering principles and practices.',
        },
        {
            courseId: 'CY',
            courseName: 'Cybersecurity',
            description: 'A course on Cybersecurity principles and practices.',
        },
    ];


    const createdCourses = await Course.insertMany(courses);

    //Helper function to get courses by course ID

    const getCourseById = (id) => createdCourses.find(course => course.courseId === id);

    //Create Academic Years
    const academicYears = [
        { academicYearId: 'SEY1', yearNumber: 1, course: getCourseById('SE')._id },
        { academicYearId: 'SEY2', yearNumber: 2, course: getCourseById('SE')._id },
        { academicYearId: 'SEY3', yearNumber: 3, course: getCourseById('SE')._id },
        { academicYearId: 'CY1', yearNumber: 1, course: getCourseById('CS')._id },
        { academicYearId: 'CY2', yearNumber: 2, course: getCourseById('CS')._id },
        { academicYearId: 'CY3', yearNumber: 3, course: getCourseById('CS')._id },
    ];


    const createdAcademicYears = await AcademicYear.insertMany(academicYears);


    //Helper function to get academic years by academic year ID

    const getAcademicYearById = (id) => createdAcademicYears.find(year => year.academicYearId === id);


    

    //Create Semesters

    const semesters = [
        { semesterId: 'SEY1S1', semesterNumber: 1, academicYear: getAcademicYearById('SEY1')._id },
        { semesterId: 'SEY1S2', semesterNumber: 2, academicYear: getAcademicYearById('SEY1')._id },
        { semesterId: 'SEY2S1', semesterNumber: 1, academicYear: getAcademicYearById('SEY2')._id },
        { semesterId: 'SEY2S2', semesterNumber: 2, academicYear: getAcademicYearById('SEY2')._id },
        { semesterId: 'SEY3S1', semesterNumber: 1, academicYear: getAcademicYearById('SEY3')._id },
        { semesterId: 'SEY3S2', semesterNumber: 2, academicYear: getAcademicYearById('SEY3')._id },
        { semesterId: 'CY1S1', semesterNumber: 1, academicYear: getAcademicYearById('CY1')._id },
        { semesterId: 'CY1S2', semesterNumber: 2, academicYear: getAcademicYearById('CY1')._id },
        { semesterId: 'CY2S1', semesterNumber: 1, academicYear: getAcademicYearById('CY2')._id },
        { semesterId: 'CY2S2', semesterNumber: 2, academicYear: getAcademicYearById('CY2')._id },
        { semesterId: 'CY3S1', semesterNumber: 1, academicYear: getAcademicYearById('CY3')._id },
        { semesterId: 'CY3S2', semesterNumber: 2, academicYear: getAcademicYearById('CY3')._id },
    ];

    const createdSemesters = await Semester.insertMany(semesters);

    //Helper function to get semesters by semester ID

    const getSemesterById = (id) => createdSemesters.find(semester => semester.semesterId === id);

    //Create Modules

    const modules = [
        { moduleId: 'SEY1S1M1', moduleName: 'Introduction to Programming', description: 'Basic programming concepts.', semester: getSemesterById('SEY1S1')._id },
        { moduleId: 'SEY1S1M2', moduleName: 'Discrete Mathematics', description: 'Mathematical structures for CS.', semester: getSemesterById('SEY1S1')._id },
        { moduleId: 'SEY1S2M1', moduleName: 'Data Structures and Algorithms', description: 'Core CS concepts.', semester: getSemesterById('SEY1S2')._id },
        { moduleId: 'SEY1S2M2', moduleName: 'Computer Architecture', description: 'Basic computer architecture.', semester: getSemesterById('SEY1S2')._id },
        { moduleId: 'SEY2S1M1', moduleName: 'Object-Oriented Programming', description: 'Advanced programming techniques.', semester: getSemesterById('SEY2S1')._id },
        { moduleId: 'SEY2S1M2', moduleName: 'Database Management Systems', description: 'Introduction to databases.', semester: getSemesterById('SEY2S1')._id },
        { moduleId: 'SEY2S2M1', moduleName: 'Software Engineering Principles', description: 'Principles of software engineering.', semester: getSemesterById('SEY2S2')._id },
        { moduleId: 'SEY2S2M2', moduleName: 'Web Development', description: 'Front-end and back-end web development.', semester: getSemesterById('SEY2S2')._id },
        { moduleId: 'SEY3S1M1', moduleName: 'Software Project Management', description: 'Managing software projects.', semester: getSemesterById('SEY3S1')._id },
        { moduleId: 'SEY3S1M2', moduleName: 'Mobile Application Development', description: 'Development of mobile apps.', semester: getSemesterById('SEY3S1')._id },
        { moduleId: 'SEY3S2M1', moduleName: 'Advanced Software Engineering (Design Patterns)', description: 'Software design patterns.', semester: getSemesterById('SEY3S2')._id },
        { moduleId: 'SEY3S2M2', moduleName: 'Cloud Computing and DevOps', description: 'Introduction to cloud computing.', semester: getSemesterById('SEY3S2')._id },
        { moduleId: 'CY1S1M1', moduleName: 'Fundamentals of Cybersecurity', description: 'Basic cybersecurity concepts.', semester: getSemesterById('CY1S1')._id },
        { moduleId: 'CY1S1M2', moduleName: 'Network Fundamentals', description: 'Introduction to networking.', semester: getSemesterById('CY1S1')._id },
        { moduleId: 'CY1S2M1', moduleName: 'Cryptography Basics', description: 'Introduction to cryptography.', semester: getSemesterById('CY1S2')._id },
        { moduleId: 'CY1S2M2', moduleName: 'Operating Systems Security', description: 'Security aspects of OS.', semester: getSemesterById('CY1S2')._id },
        { moduleId: 'CY2S1M1', moduleName: 'Ethical Hacking', description: 'Ethical hacking techniques.', semester: getSemesterById('CY2S1')._id },
        { moduleId: 'CY2S1M2', moduleName: 'Digital Forensics', description: 'Basics of digital forensics.', semester: getSemesterById('CY2S1')._id },
        { moduleId: 'CY2S2M1', moduleName: 'Secure Software Development', description: 'Secure coding practices.', semester: getSemesterById('CY2S2')._id },
        { moduleId: 'CY2S2M2', moduleName: 'Advanced Network Security', description: 'Advanced networking security.', semester: getSemesterById('CY2S2')._id },
        { moduleId: 'CY3S1M1', moduleName: 'Advanced Cryptography', description: 'Advanced cryptography techniques.', semester: getSemesterById('CY3S1')._id },
        { moduleId: 'CY3S1M2', moduleName: 'Cloud Security', description: 'Security in cloud environments.', semester: getSemesterById('CY3S1')._id },
        { moduleId: 'CY3S2M1', moduleName: 'Incident Response and Management', description: 'Incident response strategies.', semester: getSemesterById('CY3S2')._id },
        { moduleId: 'CY3S2M2', moduleName: 'Penetration Testing', description: 'Penetration testing methodologies.', semester: getSemesterById('CY3S2')._id },
    ];

    const createdModules = await Module.insertMany(modules);


     // Update Courses with Academic Year references
     for (const course of createdCourses) {
        const academicYearsForCourse = createdAcademicYears.filter(year => year.course.toString() === course._id.toString());
        course.years = academicYearsForCourse.map(year => year._id);
        await course.save();
    }

    //Updateing the Semester documents to include reference to their Modules 

    for (const semester of createdSemesters) {
        const semesterModules = createdModules.filter(module => module.semester.toString() === semester._id.toString());
        semester.modules = semesterModules.map(module => module._id);
        await semester.save();
    }

    //Updating the Modules to have a reference to their Course

    for (const module of createdModules) {
        const semester = createdSemesters.find(semester => semester._id.toString() === module.semester.toString());
        const academicYear = createdAcademicYears.find(year => year._id.toString() === semester.academicYear.toString());
        const course = createdCourses.find(course => course._id.toString() === academicYear.course.toString());
        module.course = course._id;
        await module.save();
    }




    

    console.log('Data Seeded Successfully!');
    await mongoose.connection.close();
}


//Updating the Year document to include referene to academic years



seedDatabase().catch(err => {
    console.error(err);
    mongoose.connection.close();
  });