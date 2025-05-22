import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimetableSettings, TimeSlot, TimetableDraft } from "@/types/timetable";
import {
  generateTimetable,
  convertToTimetableData,
} from "@/utils/timetableGenerator";
import { Timer } from "lucide-react";
import * as sectionBData from "@/data/index2";
import { subjectData, staffData } from "@/data";

// Default period timings
const defaultPeriodTimings = [
  "8:30-9:20",
  "9:20-10:10",
  "10:10-11:00",
  "11:15-12:00", // After tea break
  "12:00-12:45",
  "1:35-2:25", // After lunch break
  "2:25-3:15",
];

// Function to check lab collisions between two timetables
const checkLabCollisions = (newTimetable, existingTimetable, labSubjectIds) => {
  // If there's no existing timetable, there can't be collisions
  if (!existingTimetable || existingTimetable.length === 0) return false;
  
  // Create a map of day-period-labId for the existing timetable
  const existingLabSlots = new Map();
  
  existingTimetable.forEach(slot => {
    // Only consider lab subjects
    if (labSubjectIds.includes(slot.subjectId)) {
      const key = `${slot.day}-${slot.period}`;
      existingLabSlots.set(key, slot.subjectId);
    }
  });
  
  // Check if any lab in the new timetable conflicts with existing labs
  for (const slot of newTimetable) {
    if (labSubjectIds.includes(slot.subjectId)) {
      const key = `${slot.day}-${slot.period}`;
      const existingLabId = existingLabSlots.get(key);
      
      // If there's a lab in the same slot and it's the same lab ID, we have a collision
      if (existingLabId && existingLabId === slot.subjectId) {
        return true;
      }
    }
  }
  
  return false;
};

const TimetableGenerator: React.FC = () => {
  const { year, dept, section } = useParams<{
    year: string;
    dept: string;
    section: string;
  }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [periodsPerDay, setPeriodsPerDay] = useState<number>(7);
  const [showTeaBreak, setShowTeaBreak] = useState<boolean>(true);
  const [showLunchBreak, setShowLunchBreak] = useState<boolean>(true);
  const [hardConstraints, setHardConstraints] = useState({
    noTeacherOverlap: true,
    exactSubjectCounts: true,
    preserveLockedSlots: true,
  });
  const [softConstraints, setSoftConstraints] = useState({
    loadBalancing: true,
    priorityScheduling: true,
    labClustering: true,
    teacherPreferences: false,
    requireBackupTeacher: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimeSlot[]>([]);

  const [staff, setStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [otherSectionTimetable, setOtherSectionTimetable] = useState(null);
  const [labSubjectIds, setLabSubjectIds] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");

  useEffect(() => {
    if (section === "B") {
      setStaff(sectionBData.staffData);
      setSubjects(sectionBData.subjectData);
      
      // For Section B, check if Section A timetable exists
      const sectionATimetableKey = `timetable_draft_${year}_${dept}_A`;
      const sectionATimetable = localStorage.getItem(sectionATimetableKey);
      if (sectionATimetable) {
        try {
          const parsedTimetable = JSON.parse(sectionATimetable);
          setOtherSectionTimetable(parsedTimetable.timeSlots);
        } catch (error) {
          console.error("Error parsing Section A timetable:", error);
        }
      }
    } else {
      setStaff(staffData);
      setSubjects(subjectData);
      
      // For Section A, check if Section B timetable exists
      const sectionBTimetableKey = `timetable_draft_${year}_${dept}_B`;
      const sectionBTimetable = localStorage.getItem(sectionBTimetableKey);
      if (sectionBTimetable) {
        try {
          const parsedTimetable = JSON.parse(sectionBTimetable);
          setOtherSectionTimetable(parsedTimetable.timeSlots);
        } catch (error) {
          console.error("Error parsing Section B timetable:", error);
        }
      }
    }
    
    // Extract lab subject IDs from both section data
    const labIds = [
      "7",  // Data Science and Analytics Laboratory
      "8",  // Machine Learning Laboratory
      "9",  // Computer Networks Laboratory
      "30", // Activity Hour
    ];
    
    setLabSubjectIds(labIds);
  }, [section, year, dept]);

  // Calculate total periods selected
  const totalPeriodsSelected = selectedSubjects.reduce((total, subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return total + (subject?.periodsPerWeek || 0);
  }, 0);

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects((prev) => [...prev, subjectId]);
    } else {
      setSelectedSubjects((prev) => prev.filter((id) => id !== subjectId));
    }
  };

  const handleGenerate = () => {
    if (selectedSubjects.length === 0) {
      toast({
        title: "Selection Required",
        description:
          "Please select at least one subject to generate a timetable",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setRetryCount(0);
    setGenerationStatus("Optimizing faculty schedules...");
    generateTimetableWithCollisionCheck();
  };

  const generateTimetableWithCollisionCheck = () => {
    // Prepare the subjects for generation
    const subjectsToUse = subjects.filter((subject) =>
      selectedSubjects.includes(subject.id)
    );

    // Prepare the timetable settings
    const timetableSettings: TimetableSettings = {
      periodsPerDay,
      periodTimings: defaultPeriodTimings.slice(0, periodsPerDay),
      breaks: [
        ...(showTeaBreak ? [{ name: "Tea Break", after: 3 }] : []),
        ...(showLunchBreak ? [{ name: "Lunch Break", after: 5 }] : []),
      ],
      hardConstraints,
      softConstraints,
    };

    // Generate the timetable after a short delay to allow the UI to update
    setTimeout(() => {
      try {
        // Generate the timetable using our algorithm
        const timetable = generateTimetable(
          subjectsToUse,
          staff,
          timetableSettings
        );

        // Check for lab collisions with the other section's timetable
        const hasCollisions = otherSectionTimetable && 
          checkLabCollisions(timetable, otherSectionTimetable, labSubjectIds);

        if (hasCollisions && retryCount < 5) { 
          // Retry generation if there are collisions (with a limit)
          setRetryCount(prevCount => prevCount + 1);
          setGenerationStatus(`Avoiding lab conflicts, attempt ${retryCount + 1}...`);
          generateTimetableWithCollisionCheck();
          return;
        }

        if (hasCollisions) {
          // If we still have collisions after max retries, warn the user but continue
          toast({
            title: "Lab Conflict Warning",
            description: "Could not avoid lab conflicts with the other section after multiple attempts.",
          });
        }

        // Store the generated timetable
        setGeneratedTimetable(timetable);

        // Save as a draft
        const draft: TimetableDraft = {
          id: `${year}_${dept}_${section}_draft`,
          name: `${year} Year ${dept} Section ${section} Draft`,
          year: year || "",
          dept: dept || "",
          section: section || "",
          timeSlots: timetable,
          lastUpdated: new Date(),
        };

        // Store the draft in localStorage
        localStorage.setItem(
          `timetable_draft_${year}_${dept}_${section}`,
          JSON.stringify(draft)
        );

        // Convert to UI format and store for the timetable view
        const uiTimetableData = convertToTimetableData(
          timetable,
          subjectsToUse,
          staff
        );
        localStorage.setItem(
          `timetable_ui_${year}_${dept}_${section}`,
          JSON.stringify(uiTimetableData)
        );

        setIsGenerating(false);
        setGenerationComplete(true);

        toast({
          title: "Timetable Generated",
          description: "The timetable draft has been successfully created",
        });
      } catch (error) {
        console.error("Error generating timetable:", error);
        setIsGenerating(false);

        toast({
          title: "Generation Failed",
          description:
            "There was an error generating the timetable. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  // Function to handle view draft timetable button click
  const handleViewDraft = () => {
    toast({
      title: "Redirecting",
      description: "Taking you to the draft timetable editor",
    });
    // Navigate to the timetable view page
    navigate(`/admin/timetables/${year}/${dept}/${section}/draft`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to={`/admin/dashboard/${year}`}
            className="text-muted-foreground hover:text-foreground"
          >
            {year} Year
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to={`/admin/dashboard/${year}/${dept}`}
            className="text-muted-foreground hover:text-foreground"
          >
            {dept}
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to={`/admin/dashboard/${year}/${dept}/${section}`}
            className="text-muted-foreground hover:text-foreground"
          >
            Section {section}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Timetables</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight mt-2">
          Generate Timetable
        </h2>
        <p className="text-muted-foreground">
          {year} Year {dept} - Section {section}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Staff Assignment</CardTitle>
              <CardDescription>
                Faculty members available for this section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff
                  .filter((staff) => staff.id !== "ALL")
                  .map((staff) => (
                    <div
                      key={staff.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {staff.email}
                        </p>
                      </div>
                      <div className="text-sm">
                        Max:{" "}
                        <span className="font-medium">{staff.maxPeriods}</span>{" "}
                        periods/day
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Subjects</CardTitle>
              <CardDescription>
                Choose which subjects to include in this timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Theory Subjects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects
                    .filter((subject) => subject.type === "Theory")
                    .map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center space-x-2 border rounded-md p-3"
                      >
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={(checked) =>
                            handleSubjectToggle(subject.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-0.5">
                          <Label
                            htmlFor={subject.id}
                            className="font-medium cursor-pointer"
                          >
                            {subject.code} ({subject.title})
                          </Label>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{subject.staff || "Unassigned"}</span>
                            <span>{subject.periodsPerWeek} periods</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <h3 className="font-medium text-sm mt-6">Lab Sessions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects
                    .filter((subject) => subject.type === "Lab")
                    .map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center space-x-2 border rounded-md p-3"
                      >
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={(checked) =>
                            handleSubjectToggle(subject.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-0.5 w-full">
                          <Label
                            htmlFor={subject.id}
                            className="font-medium cursor-pointer"
                          >
                            {subject.code} ({subject.title})
                          </Label>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{subject.staff || "Unassigned"}</span>
                            <span>
                              {subject.periodsPerWeek} periods (continuous)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <h3 className="font-medium text-sm mt-6">Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects
                    .filter((subject) => subject.type === "Activity")
                    .map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center space-x-2 border rounded-md p-3"
                      >
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={(checked) =>
                            handleSubjectToggle(subject.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-0.5">
                          <Label
                            htmlFor={subject.id}
                            className="font-medium cursor-pointer"
                          >
                            {subject.code} ({subject.title})
                          </Label>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{subject.staff || "Unassigned"}</span>
                            <span>{subject.periodsPerWeek} periods</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium">Weekly Summary</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>Total Selected:</div>
                  <div className="font-medium">
                    {totalPeriodsSelected} periods
                  </div>
                  <div>Theory:</div>
                  <div className="font-medium">
                    {selectedSubjects.reduce((total, subjectId) => {
                      const subject = subjects.find(
                        (s) => s.id === subjectId && s.type === "Theory"
                      );
                      return total + (subject?.periodsPerWeek || 0);
                    }, 0)}{" "}
                    periods
                  </div>
                  <div>Lab Sessions:</div>
                  <div className="font-medium">
                    {selectedSubjects.reduce((total, subjectId) => {
                      const subject = subjects.find(
                        (s) => s.id === subjectId && s.type === "Lab"
                      );
                      return total + (subject?.periodsPerWeek || 0);
                    }, 0)}{" "}
                    periods
                  </div>
                  <div>Activities:</div>
                  <div className="font-medium">
                    {selectedSubjects.reduce((total, subjectId) => {
                      const subject = subjects.find(
                        (s) => s.id === subjectId && s.type === "Activity"
                      );
                      return total + (subject?.periodsPerWeek || 0);
                    }, 0)}{" "}
                    periods
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timetable Settings</CardTitle>
              <CardDescription>Configure generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="periodsPerDay">Periods Per Day</Label>
                <Input
                  id="periodsPerDay"
                  type="number"
                  min={1}
                  max={10}
                  value={periodsPerDay}
                  onChange={(e) => setPeriodsPerDay(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Break Slots</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="teaBreak"
                    checked={showTeaBreak}
                    onCheckedChange={setShowTeaBreak}
                  />
                  <Label htmlFor="teaBreak">Tea Break (after P3)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lunchBreak"
                    checked={showLunchBreak}
                    onCheckedChange={setShowLunchBreak}
                  />
                  <Label htmlFor="lunchBreak">Lunch Break (after P5)</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hard Constraints</Label>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="noTeacherOverlap"
                      checked={hardConstraints.noTeacherOverlap}
                      onCheckedChange={(checked) =>
                        setHardConstraints({
                          ...hardConstraints,
                          noTeacherOverlap: checked,
                        })
                      }
                    />
                    <Label htmlFor="noTeacherOverlap">No teacher overlap</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="exactSubjectCounts"
                      checked={hardConstraints.exactSubjectCounts}
                      onCheckedChange={(checked) =>
                        setHardConstraints({
                          ...hardConstraints,
                          exactSubjectCounts: checked,
                        })
                      }
                    />
                    <Label htmlFor="exactSubjectCounts">
                      Exact subject counts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserveLockedSlots"
                      checked={hardConstraints.preserveLockedSlots}
                      onCheckedChange={(checked) =>
                        setHardConstraints({
                          ...hardConstraints,
                          preserveLockedSlots: checked,
                        })
                      }
                    />
                    <Label htmlFor="preserveLockedSlots">
                      Preserve locked slots
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Soft Constraints</Label>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="loadBalancing"
                      checked={softConstraints.loadBalancing}
                      onCheckedChange={(checked) =>
                        setSoftConstraints({
                          ...softConstraints,
                          loadBalancing: checked,
                        })
                      }
                    />
                    <Label htmlFor="loadBalancing">Load balancing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="priorityScheduling"
                      checked={softConstraints.priorityScheduling}
                      onCheckedChange={(checked) =>
                        setSoftConstraints({
                          ...softConstraints,
                          priorityScheduling: checked,
                        })
                      }
                    />
                    <Label htmlFor="priorityScheduling">
                      Priority scheduling
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="labClustering"
                      checked={softConstraints.labClustering}
                      onCheckedChange={(checked) =>
                        setSoftConstraints({
                          ...softConstraints,
                          labClustering: checked,
                        })
                      }
                    />
                    <Label htmlFor="labClustering">Lab clustering</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="teacherPreferences"
                      checked={softConstraints.teacherPreferences}
                      onCheckedChange={(checked) =>
                        setSoftConstraints({
                          ...softConstraints,
                          teacherPreferences: checked,
                        })
                      }
                    />
                    <Label htmlFor="teacherPreferences">
                      Teacher time preferences
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireBackupTeacher"
                      checked={softConstraints.requireBackupTeacher}
                      onCheckedChange={(checked) =>
                        setSoftConstraints({
                          ...softConstraints,
                          requireBackupTeacher: checked,
                        })
                      }
                    />
                    <Label htmlFor="requireBackupTeacher">
                      Backup teacher requirement
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || selectedSubjects.length === 0}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <Timer className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                    Generating...
                  </div>
                ) : (
                  "Generate Timetable"
                )}
              </Button>
            </CardFooter>
          </Card>

          {otherSectionTimetable && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cross-Section Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    Section {section === "A" ? "B" : "A"} timetable detected. Lab sessions will be scheduled to avoid conflicts.
                  </p>
                  <div className="flex items-center space-x-2 text-xs bg-muted p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>
                      The system will attempt to avoid scheduling the same lab at the same time for both sections.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {generationComplete && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Generation Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Timetable draft created!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click below to view and edit.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleViewDraft}
                >
                  View Draft Timetable
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* AI generation dialog */}
      <Dialog open={isGenerating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI is generating your timetable</DialogTitle>
            <DialogDescription>
              This process may take a few moments to complete
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="spinner h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                {generationStatus}
              </p>
              <p className="text-xs text-muted-foreground">
                {retryCount > 0 ? `Attempt ${retryCount} of 5 to avoid lab conflicts` : "Applying hard and soft constraints"}
              </p>
            </div>
          </div>
          <style>{`.radix-dialog-close-button { display: none; }`}</style>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimetableGenerator;