# TÀI LIỆU: He_ieu_Hanh_chap_3-Eng_Hust_THeme_Autosaved_1.pdf

- **Thời gian lưu:** 11:12:57 31/7/2026
- **URL đính kèm:** https://cdn.discordapp.com/attachments/1532309198153580605/1532315269328932935/He_ieu_Hanh_chap_3-Eng_Hust_THeme_Autosaved_1.pdf?ex=6a6d100d&is=6a6bbe8d&hm=071f990f0939083b345c8cfebe5c5b5566518607c8ff79565accee16d5fd4a81&

## TÓM TẮT Ý CHÍNH
Tải lên bởi Tuanminh1509hp trong kênh #tài-nguyên

## NỘI DUNG CHI TIẾT TRÍCH XUẤT
```text
Operating System
(Operating System Principles)
•Department of Computer Science
•School of Information and Communication Technology

Chap 3 Memory Management
①Introduction
②Memory management strategies
③Virtual memory
④Memory management in Intel’s processors family

Chapter3Memory management
1. Introduction
•Example
•Memory and program
•Address binding
•Program’s structures

C compilation process
Chapter 3 Memory management
          1. Introduction
            

C compilation process
Chapter 3 Memory management
          1. Introduction
            

C compilation process
Chapter 3 Memory management
          1. Introduction
            

C compilation process
Chapter 3 Memory management
          1. Introduction
            

C compilation process
Chapter 3 Memory management
          1. Introduction
            

Totoproject
filemain.c
#include <stdio.h>  
extern int x, y;  
extern voidtoto();
int main(int argc, char *argv[]){  
toto();
printf("KQ: %d \n",x * y);  
return0;
}
fileM1.c
int y =10;
fileM2.c
int x;  
extern int y;  
voidtoto(){
x = 10 *y;
}
Result 
KQ:1000
Example: Generate programs from multimoduls
Chapter 3 Memory management
          1. Introduction
            

extern intx,y;
extern void toto();  
intmain(){
toto()  
printf()
}
main.c
inty=10;
M1.c
intx;
extern int y;  
toto()
M2.c
Compiler
(tcc-c)
x
y
toto
printf
main.o
[y←10]
M1.o
[x]  
y
[toto]
M2.o
Thưviện
[printf]
Link
(tlink)
Header
[y←10]
[x]
[printf]
-
-
[toto]
x
y
toto
printf  
x
y
Chapter3Memory management
          1. Introduction
            1.1 Example
toto project compilation process
toto.exe

Chapter3Memory management
          1. Introduction
 1.2. Memory and program
•Example
•Memory and program
•Address binding
•Program’s structures

Memory 
•an important system’s resource
•program must be in internal memory for execution
•characterized by size and speed of access
•decentralized according to access speed
Memory typeSizeSpeed
Registers 
Cache on processor
Cache level2 
Main memory
Secondary storage(Disk) 
Tape, optical disk
bytes 
Kilo Bytes
KiloByte-MegaByte MegaByte-
GigaByte
GigaByte-Terabytes
Unlimited
CPU speed (ηs) 10 
nano seconds
100 nanoseconds e Micro-
seconds
Mili-Seconds 10 Seconds
Memory leveling
Chapter 3 Memory management
          1. Introduction
            

00000
00001
FFFFE  
FFFFF
Memory
•Used for running program and data
•Array of memory block with size ofbytes,words
•Each memory block has an address
•Physical address
Main memory
Chapter 3 Memory management
          1. Introduction
            

•Stored on external storage devices
•Executable binary files
•File’s parameters
•Machine instruction(binary code), 
•Data area (global variable), . . 
•Must be brought into internal memory 
and put inside a process to be 
executed(process executes program) 
•Input queue 
•Set of processes kept in external 
memory(normally:disk) 
•Wait to be brought into internal 
memory and execute
Program
Chapter 3 Memory management
          1. Introduction
            

⚫Load the program into main memory
•Read and analysis executable file(e.g.*.com, file *.exe) 
•Ask for a memory area to load program from disk
•Set values for parameters, registers to a proper value
⚫Execute the program
•CPU reads instructions in memory at location determined by 
program counter 
•2 registersCS:IP forIntel’s family processor(e.g.: 80x86)
•CPU decode the instruction
•May read more operand from memory
•Execute the instruction with operand
•If necessary, store the results into memory at a defined location
Steps to execute the program
Chapter 3 Memory management
          1. Introduction
            

⚫Finish executing
•Free the memory area that allocated to program
⚫Problem
•Program may be loaded into any location in the 
memory
•When program is executed, a sequence of addresses 
are generated
•How to access memory?
Steps to execute the program
Chapter 3 Memory management
          1. Introduction
            

Chapter3Memory management
          1. Introduction
 1.3. Address binding
⚫Example
⚫Memory and program
⚫Address binding
⚫Program’s structures

Main memory
Program’s 
source
Com
-pile
Fetch
Program 
inside 
memory
Other object 
modules
System’s 
library
Dynamic 
loading 
system’s 
library
Link
Object 
Modul
Executive
Modul 
Dynamic link
Application program processing steps
Chapter 3 Memory management
          1. Introduction
            

⚫Symbolic 
•Name of object in the source program
•Example: counter, x, y,...
⚫Relative address
•Generated from symbolic address by compiler 
•Relative position of an object from the module’s first position
•Example: Byte number10 from the begin ofmodule
Types of address
Chapter 3 Memory management
          1. Introduction
            

Types of address
⚫Absolute address
•Generate from relative address when program is loaded into 
memory
•For IBMPC: relative address<Seg :Ofs>→ Seg * 16+Ofs
•Object’s address in physical memory – physical address
•Example: JMP 010Ah ⇒jump to the memory block at010Ah 
at the same code segment(CS) 
•ifCS=1555h, jump to location: 1555h*10h+010Ah 
=1565Ah
Chapter 3 Memory management
          1. Introduction
            

Physical address-logic address
Physic
address
Logic 
address
Address register
Memory
•Logic address
•Generate from process, (CPU brings out) 
•Converted to physical address when access to object in the 
program by the Memory management unit (MMU)
•Physical address
•Address of an element(byte/word) in main memory
•Correspond to the logic address bring out by CPU
•Program work with logical address
Chapter 3 Memory management
          1. Introduction
            

Chapter3Memory management
          1. Introduction
 
⚫Example
⚫Memory and program
⚫Address binding
⚫Program’s structures

①Linear structure
②Dynamic loading structure
③Dynamic link structure
④Overlays structure
Chapter 3 Memory management
          1. Introduction
 

M
0
M
1
M
2
M
3
Linker
M
0
M
1
M
2
M
3
•After linking, modules are merged into a complete program
•Contain sufficient information to be able to execute
•External pointers are replaced by defined values
•To execute, required only one time to fetch into the memory
Linear structure
Chapter 3 Memory management
          1. Introduction
 

Chapter 3 Memory management
Linear structure
1. Introduction
1.4. Program’s structures
•Advantages
•Simple, easy to link and localizing the program
•Fast to execute
•Highly movable
•Disadvantages
•Waste of memory
•Not all parts of the program are necessary for the 
program’s execution
•It’s not possible to run the program that larger than physical 
memory’s size

M
0
M
1
M
2
M
3
Operating System
⚫Each module is edited separately
Chapter 3 Memory management
Dynamic loading structure
1. Introduction
1.4. Program’sstructures

M
0
M
1
M
2
M
3
Operating System
M
0
⚫Each module is edited separately
⚫When executing, system will load and localize the main module
Dynamic loading structure
1. Introduction
1.4. Program’sstructures

M
0
M
1
M
2
M
3
Operating System
M
0
M
1
•Each module is edited separately
•When executing, system will load and localize the main 
module
•When module is needed, request for memory and load 
module into memory
Chapter 3 Memory management
Dynamic loading structure
1. Introduction
1.4. Program’sstructures

M
0
M
1
M
2
M
3
Operating System
M
0
M
1
M
2
•Each module is edited separately
•When executing, system will load and localize the main module
•When module is needed, request for memory and load module 
into memory
Chapter 3 Memory management
Dynamic loading structure
1. Introduction
1.4. Program’sstructures

M
0
M
1
M
2
M
3
Operating System
M
0
M
1
M
2
•Each module is edited separately
•When executing, system will load and localize the main module
•When module is needed, request for memory and load module 
into memory
•When a module is finished using or not enough memory, bring 
unnecessary modules out
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Dynamic loading structure

M
0
M
1
M
2
M
3
Operating System
M
0
M
3
⚫Each module is edited separately
⚫When executing, system will load and localize the main module
⚫When module is needed, request for memory and load module 
into memory
⚫When a module is finished using or not enough memory, bring 
unnecessary modules out
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Dynamic loading structure

Advantage
⚫Can use memory are smaller than the program’s size
⚫High memory usage effectiveness if program is managed well
Disadvantage
⚫Slow when execution
⚫Mistake may cause waste of memory and increase execution time
⚫Require user to load and remove modules
⚫User must understand clearly about the system
⚫Reduce the program’s flexible
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Dynamic loading structure

M
toto()
toto()
M
toto
⚫Links will be postponed when program is 
executing
⚫Part of the code segment (stub) is utilized to 
search for corresponding function in the 
library in the memory
⚫When found, stub will be replaced by the 
address of the function and function will be 
executed
⚫Useful for library constructing 
Operating system
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Dynamic-link structure

⚫Moduls are divided into different levels
⚫Level0 containsmain modul, load and localize the program
⚫Level1 contains modules called from level 0’s module and these 
modules do not exist at the same time
⚫. . .
⚫Memory is also divided into levels corresponding to program’s levels
⚫Size equal to the same level’s largest module’s size
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure       I

⚫Overlay structure requires extra information
⚫how many levels is program divided into, which modules lie in 
each levels
⚫Information is stored in a file(overlay map)
⚫Moduleat level0 is edited into an independent executable file
⚫When program is executed
⚫Load level 0 module like a linear structure program
⚫When another module is needed, load that module into 
corresponding memory’s level
⚫If there are module in the same level exist, bring that 
module out
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure       II

Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

M
0
80K
80K
120K
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

M
0
80K
M
1
80K
120K
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

M
0
80K
M
1
80K
M
11
120K
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

80K
80K
120K
M
0
M
1
M
11
M
11
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

M
0
80K
M
1
80K
M
12
120K
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

80K
80K
120K
M
0
M
1
M
12
M
1
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

M
1
M
0
80K
M
2
80K
M
12
120K
Bộ nhớ trong
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure
Main 
memory

⚫Allow program with size > memory area size allocated by the 
OS
⚫Require extra information from user
•Effectiveness is depended on provided information
⚫Memory usage effectiveness is depended on how program’s 
modules are organized
•If there are modules that larger than other modules in the 
same level⇒ the effectiveness is reduced
⚫Module loading progression is dynamic, but program’s 
structure is static⇒ not change at each execution time
•Provided more memory, the effectiveness does not 
increase
Chapter 3 Memory management
1. Introduction
1.4. Program’s structures
Overlays structure - Conclusion

Chap 3 Memory Management
①Introduction
②Memory management strategies
③Virtual memory
④Memory management in Intel’s processors family

Chapter3Memory management
         2. Memory management strategies
⚫Fixed partition strategy
⚫Dynamic partition strategy
⚫Segmentation strategy
⚫Paging strategy
⚫Segmentation and paging combination strategy

Operating System
Partition1
Partition2
Partition3
ProcessSizetime
P
1
12020
P
2
8015
P
3
705
P
4
505
P
5
14012
Queue
⚫Memory is divided intonparts
⚫Each part is called a partition
⚫size:can be unequal
⚫Utilized as and independent memory area
⚫At a single time, only 1 program is allowed to exist
⚫Programs stay inside memory until finish
⚫Example: Consider the following system
0
150
300
500
600
Chapter 3 Memory management
         2. Memory management strategy
2.1 Fixed partition strategy
Rule

⚫Simple, easy for memory protection
•Program and memory area have a protection lock
•Compare 2 locks when program is loaded
⚫Reduce searching time
⚫Must copy controlling module into many versions and save at many 
places
⚫Parallel cannot be more than n
⚫Memory is fragmented
•Program’s size is larger than the largest partition's size
•Total free memory is large enough but can not load any program
   ⇒Fix partition structure, merge neighboring partition
⚫Application
•Large size disk management
•IBM OS/360 operating system
Chapter 3 Memory management
         2. Memory management strategy
2.1 Fixed partition strategy
Conclude

Chapter3Memory management
         2. Memory management strategies
⚫Fixed partition strategy
⚫Dynamic partition strategy
⚫Segmentation strategy
⚫Paging strategy
⚫Segmentation and paging combination strategy

Only 1 management list (ML) for free memory
⚫At the start, the whole memory is empty for processes⇒largest hole
⚫When a process requests for memory
•Search in the ML for a large enough hole for request
•If found
•Hole is divided into 2 parts
•1 part allocated to process as requested
•1 part returned to the ML
•If not found
•Wait until there is a hole large enough
•Allow another process in the queue to execution(if the priority 
is guaranteed)
⚫When the process finish
•Allocated memory area is returned to the free memory ML
•Combine with other neighboring holes if necessary
Chapter 3 Memory management
         2. Memory management strategies
            2.2 Dynamic partition strategy
Rule

0
400
2560
ProcessSizetime
P
1
60010
P
2
10005
P
3
30020
P
4
7008
P
5
50015
Waiting file queue 
0
400
2560
?
Operating 
system
Operating 
system
Chapter 3 Memory management
Main memory
2. Memory management strategies
            2.2 Dynamic partition strategy

Strategies to select free area for process’s request
First Fit : First free area satisfy request
Best Fit : Most fitted area
Worst Fit : Largest area that satisfy request
Free memory area selection strategy
2. Memory management strategies
            2.2 Dynamic partition strategy

⚫Suppose free memory area have the size
   100K, 500K, 200K, 300K, and 600K (consequently), 
⚫First-fit, Best-fit, and Worst-fit
   How will process with size 212K, 417K, 112K, and 
426K loaded?
Free memory area selection strategy
2. Memory management strategies
            2.2 Dynamic partition strategy

After a long working time, the free holes are distributed and 
caused memory lacking phenomenon⇒ Need to rearrange 
memory
⚫Move processes
⚫Swapping processes
Memory reallocation problem
2. Memory management strategies
            2.2 Dynamic partition strategy

•Move process
•Problem: internal objects when move to new place will has 
new address
•Use relocation register to store process’s relocation 
value
•Select method for lowest cost
•Move all process to 1 side⇒largest free holes
•Move processes to create a sufficient free hole 
immediately
Memory reallocation problem (cont.1)
2. Memory management strategies
            2.2 Dynamic partition strategy

•Swapping process
•Select a right time to suspend process
•Bring process and corresponding state to external memory
•Free allocated memory area and combine with 
neighboring areas
•Reallocation to former place and restore state
•Use relocation register if process is moved to different 
places
Memory reallocation problem (cont.2)
2. Memory management strategies
            2.2 Dynamic partition strategy

•No need to copy the controlling modules to different places
•Increase/decrease parallel factor depend on the number and size of 
programs
•Cannot run program with size larger than the physical memory size
•Cause memory waste phenomenon
•Memory area is not used and not in the memory management list
•Cause by the operating system error
•By malicious software
•Cause external memory fragmentation phenomenon
•Free memory area is managed but distributed -> cannot used
•Cause internal memory fragmentation phenomenon
•Memory allocated to process but not used by process
Concludes
2. Memory management strategies
            2.2 Dynamic partition strategy

Chapter3Memory management
         2. Memory management strategies
⚫Fixed partition strategy
⚫Dynamic partition strategy
⚫Segmentation strategy
⚫Paging strategy
⚫Segmentation and paging combination strategy

•In general, a program includes following modules
•main program
•Set of sub-routine
•Variables, data structures,. . .
•Modules, objects in program are defined by name
•function sqrt(), procedure printf() . . . 
•x, y, counter, Buffer. . .
•Member inside a module is determined based on the distance 
from the head of the module
•Instruction 10th of function sqrt(). . . 
•2ndelement of array Buffer. . .
How program is placed inside memory? 
•Stack stay at the higher area or Data stay at the higher area? 
•Object’s physical address . . .?
⇒Usersdo notcare
Chapter 3 Memory management
Program
2. Memory management strategies
            2.3 Segmentation strategy

subroutines
array
mainprogram
data
stack
Logical address
space
When loaded into memory to execute,
Program is combined of several 
segments.Each segement
•is a logicalblock, corresponding to a 
module
•Code: main(), procedure, 
function. . . 
•Data: Global objects
•Other segments: stack, array. . .
•occupies a contiguous memory area
•Has a start position and size
•Can be located at any place in the 
memory
User’s perspective
2. Memory management strategies
            2.3 Segmentation strategy

subroutines
Array
mainprogram
data
stack
Logical address
space
•Object in a segment is defined based 
on the relative distance from the start 
of the segment
•5
th
 instruction of the main program
•1
st
 member of thestack. . .
•Where is the location of these objects 
in the memory?
User’s perspective
5
th
 instruction
1
st
 member
11
th
 
member
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg3
mainprogram
Segment 0
data
Seg4
stack
Segment1
Example
Memory
OS
Logical address
space
2. Memory management strategies
            2.3 Segmentation strategy

OS
 Segment 0
Seg 3
1400
4300
Example
Memory
Logical address
space
subroutine
Seg2
array
Seg3
mainprogram
Segment 0
data
Seg4
stack
Segment1
2. Memory management strategies
            2.3 Segmentation strategy

OS
Seg 0
1400
4300
Example
Memory
5
th
 instruction
11
th
 member
5x4
11x2
Seg 3
1420
4322
Logical address
space
subroutine
Seg2
array
Seg3
mainprogram
Segment 0
data
Seg4
stack
Segment1
2. Memory management strategies
            2.3 Segmentation strategy

MarkAddressLength
...
...
...
...
...
...
Segmentation structure
0 
... 
n
•Program is a combination ofmodul/segment
•Segment number, segment’s length
•Each segment can be edited independently.
•Compile and edit program -> create SCB (Segement Control Block) 
•Each member of SCB is corresponding to a program’s segment
•Mark(0/1) : Corresponding segment is already inside memory
•Address: Segment’s base location in memory
•Length: Segment’s length
•Accessing address: segment’s name (number) and offset
Problem: Convert from 2 dimension address to 1 dimension address
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg3
mainprogram
Segment 0
data
Seg4
stack
Segment1
Example
Memory
OS
Logical address
space
M
AL
0-1000
0-400
0-400
0-1100
0-1000
SCB
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
M
AL
114001000
16300400
0-400
132001100
147001000
SCB
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
M
AL
114001000
16300400
0-400
132001100
147001000
SCB
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <3,345> = ?
345 
member
Offset 345
3545
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
M
AL
114001000
16300400
0-400
132001100
147001000
SCB
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <4,185> =
?
4885
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
M
AL
114001000
16300400
0-400
132001100
147001000
SCB
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <2,120> =
?
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
M
AL
114001000
16300400
0-400
132001100
147001000
SCB
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <2,120> =
?
Jmp <2:120>
Seg 2
2800
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <2,120> =
?
Jmp <2:120>
Seg 2
2800
M
AL
114001000
16300400
12800400
132001100
147001000
SCB
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <2,120> =
2920
Jmp <2:120>
Seg 2
2800
M
AL
114001000
16300400
12800400
132001100
147001000
SCB
2. Memory management strategies
            2.3 Segmentation strategy

subroutine
Seg2
array
Seg 3
mainprogram
Seg0
data
Seg 4
stack
Seg1
Example
Memory
OS
Seg 0
Seg 3
Seg 4
Seg 1
1400
2400
3200
4300
4700
5700
6300
6700
Logical address
space
Address <2,450> =
?
Jmp <2:120>
Seg 2
2800
M
AL
114001000
16300400
12800400
132001100
147001000
SCB
Access error!
2. Memory management strategies
            2.3 Segmentation strategy

Address conversion: memory accessing diagram
Yes
Access 
error
Access error
No
N
o
Logic address
Segment Control Block
Memory
Physical 
address
Segment s
2. Memory management strategies
            2.3 Segmentation strategy

Process 1
Data
(Read only)
sqrt()
S
0
S
3
S
0
Conclusion: pros
•Module loading diagram does not require user ‘s participation
•Easy to protect segments
•Check memory accessing error
•Invalid address: more than segment’s length
•Check accessing’s property
•Code segment: read only-> Write into code segment: accessing error
•Check the right to access module
•Add accessing right (user/system) into SCB
•Allow segment sharing (Example:Text editor)
Process 2
2. Memory management strategies
            2.3 Segmentation strategy

Segment sharing: Main problem
•Sharing segment 
•Call (0, 120) ? 
•Read (1, 245) ?
   =>must has the same index 
number in the SCB 
2. Memory management strategies
            2.3 Segmentation strategy

Conclude: cons
•Effective is depended on the program’s structure
•Memory is fragmented
•Memory allocated by methodsfirst fit /best fit... 
•Require memory rearrangement(relocation, swapping) 
•Easier with the help of SCB 
•M ← 0 : Segment is not in memory
•Memory’s area defined by A andL is returned to the free 
memory management list
•Select which module to bring out
•Longest existed module
•Last recently used module
•Least frequently used module⇒ Require media to record 
number and time that module is accessed
•Solution: allocate memory for equal size segment (page)?
2. Memory management strategies
            2.3 Segmentation strategy

Chapter3Memory management
         2. Memory management strategies
⚫Fixed partition strategy
⚫Dynamic partition strategy
⚫Segmentation strategy
⚫Paging strategy
⚫Segmentation and paging combination strategy

Rule
Chapter 3 Memory management
•Physical memory is divided into equal size blocks: page frames
•Physical frame is addressed by number0, 1, 2, . . . : frame’s 
physical address
•Frame is the unit for memory allocation
•Program is divided into blocks that have equal size with frame
(pages) 
2. Memory management strategies
            2.4 Paging strategy

Rule (cont)
•When program is executed
•Load logical page (from external memory) into page‘s frame
•Construct a PCB(Page Control Block) to determine the relation 
between physical frame and logical page
•Each element of PCB is corresponding to a program’s page
•Show which frame is holding corresponding page
•ExamplePCB[8] = 4 ⇒?
•Accessing Address is combined of
•Page’s number(p) : Index in PCB to find page’s base address
•Displacement in page(d): Combined with base address to find the 
physical address
2. Memory management strategies
            2.4 Paging strategy

6
5
4
3
2
1
0
3
2
1
0
Page0
Page1
Page 2
Page3
Example
7
Logical 
memory
Physical 
memory
2
1
6
5
0
1
2
3
PCB
Page 0
2. Memory management strategies
            2.4 Paging strategy

6
5
4
3
2
1
0
3
2
1
0
Trang0
Trang1
Trang2
Trang3
Example
7
2
1
6
5
0
1
2
3
PCB
Page 1
3
2
1
0
Page0
Page1
Page 2
Page3
Logical 
memory
Physical 
memory
2. Memory management strategies
            2.4 Paging strategy

6
5
4
3
2
1
0
Example
7
2
1
6
5
0
1
2
3
PCB
Page 2
Logical 
memory
Physical 
memory
3
2
1
0
Trang0
Trang1
Trang2
Trang3
3
2
1
0
Page0
Page1
Page 2
Page3
2. Memory management strategies
            2.4 Paging strategy

6
5
4
3
2
1
0
Example
7
2
1
6
5
0
1
2
3
PCB
Page 3
3
2
1
0
Trang0
Trang1
Trang2
Trang3
3
2
1
0
Page0
Page1
Page 2
Page3
Logical 
memory
Physical 
memory
2. Memory management strategies
            2.4 Paging strategy

Note
⚫Frame’s size is always power of2 
⚫Allow connection between frame number and displacement
⚫Example: memory is addressed by nbit, frame’s size2
k
⚫Not necessary to load all page into memory
⚫Number of frame is limited by memory’s size
⚫Number of page can be unlimited
⚫PCB need Mark field to know if page is already loaded into memory
⚫M = 0 Page is not loaded
⚫M = 1 Page is loaded
n − k
k
displacement
frame
n bit physical address
2. Memory management strategies
            2.4 Paging strategy

Note       (cont.)
Distinguish between paging and segmentation
⚫Segmentation
⚫Module is depended on program’s structure
⚫Paging
⚫Block’s size 
⚫independent from program
⚫depended on the hardware 
⚫(e.g.: 2
9
→ 2
13
bytes)
2. Memory management strategies
            2.4 Paging strategy

Example
Physical 
memory
2
1
6
5
0
1
2
3
PCB
Logical memory
Access the logic address [ 6 ] ?
Address [ 6 ]: Page1, displacement2 
Address <1,2> = 6*4 + 2 = 26 (62
4
)
g
g
2. Memory management strategies
            2.4 Paging strategy

Program is running → Load program into memory
⚫If number of unused frame is enough ⇒load all page
⚫If not enough ⇒load parts of pages
2. Memory management strategies
            2.4 Paging strategy

Address conversion: Accessing diagram
Logic address
Page Control Block
Memory
Physical 
address
page f
2. Memory management strategies
            2.4 Paging strategy

Load and replace page
•Remark
•Number of frame allocated to program 
•Large => Faster execution speed but parallel factor decrease
•small=> High parallel factor but execution speed  slow because page is 
not inside memory
•⇒Effectiveness is depend on the page loading or page replacing strategy
•Page loading strategy
•Load all page:Load all program
•Prior loading:predict next page will be used
•Load on demand:Only load page when it’s necessary
•Page replacing strategy
•FIFOFirst In First Out 
•LRULeast Recently Used 
•LFULeast Frequently Used 
•. . .
2. Memory management strategies
            2.4 Paging strategy

Advantage
•Increase memory access speed
•Access memory 2 times (PCB and required address) 
•Perform connecting instead of adding operation
•No external fragmentation phenomenon
•High parallel factor
•Only need several program’s page inside memory
•Program can have any size
•Easy to perform memory protection
•Legally access address(not more than page size) 
•Access property(read/write) 
•Access right(user/system)
•Allow sharing page between processes
2. Memory management strategies
            2.4 Paging strategy

Page sharing: Text editor
⚫Each page size 50K 
⚫3 pages for code
⚫1 page for data
⚫40 user
⚫No sharing
⚫Need8000K
⚫Sharing
⚫Require 2150K
2. Memory management strategies
            2.4 Paging strategy

Page sharing: rule
•Necessary while working in sharing environment
•Reduce the size of memory area for all processes
•Sharing code
•Only 1 copy of sharing page in the memory
•Example: text editor, compiler....
•Problem: Sharing code can not change
•Sharing page must be in the same logic address of all address
⇒Same page id in the PCB
•The code and data are separately
•Separate for each process
•Can be in any position in the logic memory of the process
2. Memory management strategies
            2.4 Paging strategy

Disadvantage
•Have internal memory fragmentation
•Always appear at the last page
•Reduce memory fragmentation  by reduce page size? 
•Page fault more frequent
•Large page control table 
•Require support from hardware
•Cost for paging is high
•When the program is large, page control block has many members
•Program size2
30
, page size2
12 
->PCB has2
20
members
•Spend more memory for storePCB 
•Solution: multi level page
2. Memory management strategies
            2.4 Paging strategy

Multi-level paging
Rule: Divide PCB into pages
•Example: 2 level paging
•Computer use32 bit for addressing(2
32
); Page size4K (2
12
)
•Page number- 20 bit 
•Offset in page-12 bit
•PCB is paged. Page number is divided into
•Outer page table(page directory) -10 bit 
•Offset in a page directory–10 bit
•Access address has the form <p
1
, p
2
, d >
2. Memory management strategies
            2.4 Paging strategy

Multi-level page: Example2 level paging
2. Memory management strategies
            2.4 Paging strategy

Multi-level page: Memory access
•When access: System load page directory into memory
•Unused page table and unused page are not necessary loaded into 
memory
•Requireaccess memory 3 times
•Problem: For 64 bit system
•3, 4,... Level paging
•Requireaccess memory 4, 5,... times ⇒slow
•Solution: address translation buffer
2. Memory management strategies
            2.4 Paging strategy

Address translation buffer
TLB: translation look-aside buffers
•Associative registers 
•Parallel access
•Each member contains
•Key: Page number 
•Value: Frame number
•TLB contain recently 
accessing page
•When requested<p,d> 
•Searchp inTLB 
•Missing p, findp in
PCB then add< p, f > 
intoTLB
98% memory access is done via TLB
2. Memory management strategies
            2.4 Paging strategy

Chapter3Memory management
         2. Memory management strategies
⚫Fixed partition strategy
⚫Dynamic partition strategy
⚫Segmentation strategy
⚫Paging strategy
⚫Segmentation and paging combination strategy

Rule
•Program is edited as in segmentation strategy
•CreateSCB
•Each member of SCB correspond to one segment,has3 fieldsM, A, L
•Each segment is edited separately as in paging strategy
•Create PCB for each segment
•Memory accessing address: combination of3 < s, p, d > 
•Perform accessing address
•STBR + s⇒: address ofs member
•Check value of Ms, load PCBs if it’s necessary
•As + p⇒Load the address of member p in PCBs 
•Check value of Mp, loadpage pif it’s necessary
•ConnectAp withd => physical address if it’s necessary
•Utilized in processorIntel 80386, MULTICS . . . 
2. Memory management strategies
            2.4 Paging strategy

Memory access diagram
Logic address
Segment Control Block
Page Control Block
Memory
Physical 
address
Page f
2. Memory management strategies
            2.4 Paging strategy

Segmentation
MAL
0
−
2340
121405730
0
−
4264
0
−
1766
SCB
MAL
0
−
3
056
0
−
5
0
−
2
SCB
MA
0
−
18
0
−
0
−
0
−
0
−
PCB
2
Conclusion
Segmentation and paging combination 
2. Memory management strategies
            2.4 Paging strategy

Chap 3 Memory Management
①Introduction
②Memory management strategies
③Virtual memory
④Memory management in Intel’s processors family

3. Virtual memory
3.1 Introduction
①Introduction
②Page replacement strategy

Program and memory issue
•Instruction must be placed in memory when executed! 
•Whole program must stay inside memory? 
•Dynamic loading, Overlays structures... : Partly loaded
•Require special notice from programmer
•⇒ Not necessary
•Program’s segment for handling errors
•Errors occur least frequently, least frequently executed
•Unused declared data
•Declare a matrix100x100, use10x 10
•Run program with 1 part inside memory will allow
•Write program in virtual address space
•Unlimited size
•Many program concurrently existed
•⇒Increase CPU’s productivity
•Reduce I/O request for loading and swapping programs
•The size of the swapped part is smaller
3. Virtual memory
3.1 Introduction

Concept of virtual memory
•Utilize the secondary 
storage(HardDisk) to 
store the unloaded 
program’s part
•Separate logic memory
(user’s space) from 
physical memory
•Allow mapping large 
logical memory area to 
small physical memory 
area
•Implemented by
•Segmentation
•Paging
3. Virtual memory
3.1 Introduction

Load parts of program into memory
•Process’s page:
•Physical memory, 
•Some pages stay 
on disk (virtual 
memory) 
•Represented by one bit 
in the PCB
•When a page is 
required, load page 
from secondary 
memory->physical 
memory
3. Virtual memory
3.1 Introduction

Page fault handling
If there are no freeframes, need to replace pages
3. Virtual memory
3.1 Introduction

Page replacement
①Determine location of 
logical page on disk
②Select physical frame
•Write to disk
•Modify bitvalid-
invalid
③Load logic page into 
selected physical 
frame
④Restart process
3. Virtual memory
3.1 Introduction

①Introduction
②Page replacement strategy
Chapter3:  Memory management
3. Virtual memory
3.1 Introduction

Strategies
Chapter  3:  Memory management
•FIFO:First In First Out
•OPT/MIN:Optimal page replacing algorithm
•LRU: page that isLeast Recently Used
•LFU: page that isLeast Frequently Used
•MFU: page that isMost Frequently Used
•. . .
3. Virtual memory
3.2 Page replacement strategies

Example
FIFO
Remark
•Effective when the program has the linear structure
•Least effective when the program has different modules call
•Easy to implement
•Utilize a queue to store program’s pages inside memory
•Insert into last position in the queue, replace page at the first position
•Increase physical page, no guarantee of reducing page fault
•Accessing sequence: 1 2 3 4 1 2 5 1 2 3 4 5 
•3 frames: 9 page faults; 4 frames: 10 page faults
3. Virtual memory
3.2 Page replacement strategies

OPT
Rule: Replace page that has longest next used time
⚫Number of page fault is smallest
⚫Problem: it’s hard to predict program sequence
3. Virtual memory
3.2 Page replacement strategies

LRU
Rule: Replace page that is least recently used
⚫Effective for page replacing strategy
⚫Guarantee that page fault is reduced when increase physical frame
⚫Set of pages in memory with n frames is always a subset of pages in 
memory that haven + 1 frames
⚫Require support to know the last recently accessed time
⚫How to implement?
3. Virtual memory
3.2 Page replacement strategies

LRU: Implementation
⚫Counter
⚫Add one more field to record the accessed time into each member ofPCB 
⚫Add a clock/counter to the Control Unit
⚫Where there is a page access request
⚫Increase counter
⚫Copy the counter content into the newly added field inPCB
⚫Need a procedure to update PCB (write to the added field) and procedure 
to search for a smallest accessed time value
⚫Number Overflow phenomenon!?
⚫List or Stack
⚫Use a list or stack to record page number
⚫Access to a page, put corresponding member to the top position
⚫Replace: member in the last position
⚫Usually implemented as a 2 dimension linked list
⚫4 pointer assigning operation⇒time consuming
3. Virtual memory
3.2 Page replacement strategies

Algorithm based on counter
Use counter(one field of PCB) to record the last time page is 
accessed
⚫LFU: Page that has smallest counter will be replaced
⚫Page that is frequently used
⚫Important page⇒reasonable
⚫Initialization page, only used at start⇒unreasonable⇒ 
Shift right the counter by 1 bit (time div 2)
⚫MFU: Replace page with largest counter
⚫Page with smallest value, just recently loaded and not used 
much
3. Virtual memory
3.2 Page replacement strategies

Chap 3 Memory Management
①Introduction
②Memory management strategies
③Virtual memory
④Memory management in Intel’s processors family

Memory management modes
⚫Intel 8086, 8088 
⚫Only one management mode: Real Mode 
⚫Managed memory area up to 1MB ( 20bit ) 
⚫Xác định địa chỉ ô nhớ bằng 2 giá trị 16 bit: Segment, Offset 
⚫Segment register: CS, SS, DS, ES, 
⚫Offset register: IP, SP, BP... 
⚫Physical address: Seg SHL4 + Ofs
⚫Intel 80286 
⚫Real mode, compatible with8086 
⚫Protected mode
⚫Utilize segmentation method
⚫Exploit physical memory up to16M (24bit )
⚫Intel 80386, Intel 80486, Pentium,.. 
⚫Real mode, compatible with8086 
⚫Protected mode: Combination of segmentation and paging
⚫Virtual mode
⚫Allow to run 8086 code in protected mode
Chapter  3:  Memory management
4. Memory management in Intel’s processors family

Protected mode in Intel 386, 486, Pentium,..
Chapter  3:  Memory management
4. Memory management in Intel’s processors family
Chapter  3:  Memory management
4. Memory management in Intel’s processors family
```
