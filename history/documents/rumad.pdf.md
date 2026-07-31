# TÀI LIỆU: RUMAD.pdf

- **Thời gian lưu:** 11:26:26 31/7/2026
- **File gốc lưu tại:** `history/documents/files/RUMAD.pdf`
- **URL đính kèm gốc:** https://cdn.discordapp.com/attachments/1532309198153580605/1532578481790255144/RUMAD.pdf?ex=6a6d5c6f&is=6a6c0aef&hm=208058a522c849af8a54822ca51dae87f604da416871d52ff6c71230d53db2f8&

## TÓM TẮT Ý CHÍNH (AI SUMMARY)
Tải lên bởi G06 - T089 - Nguyễn Thị Hải Yến trong kênh #tài-nguyên

## TOÀN BỘ NỘI DUNG CHI TIẾT TRÍCH XUẤT
```text
RUMAD: Reinforcement-Unifying Multi-Agent Debate
AAAI Track
Chao Wang
Tsinghua University
Shenzhen, China
wangchao23@mails.tsinghua.edu.cn
Han Lin
Zhejiang University
Hangzhou, China
Tsinghua University
Shenzhen, China
hlin@zju.edu.cn
Huaze Tang
Tsinghua University
Shenzhen, China
thz21@mails.tsinghua.edu.cn
Huijing Lin
Tsinghua University
Shenzhen, China
linhj24@mails.tsinghua.edu.cn
Wenbo Ding
Tsinghua University
Shenzhen, China
ding.wenbo@sz.tsinghua.edu.cn
ABSTRACT
Multi-agent debate (MAD) systems leverage collective intelligence
to enhance reasoning capabilities, yet existing approaches struggle
to simultaneously optimize accuracy, consensus formation, and
computational efficiency. Static topology methods lack adaptability
to task complexity variations, while external LLM-based coordi-
nation risks introducing privileged knowledge that compromises
debate neutrality. This work presents RUMAD (Reinforcement-
Unifying Multi-Agent Debate), a novel framework that formu-
lates dynamic communication topology control in MAD as a rein-
forcement learning (RL) problem.
RUMAD employs a content-agnostic observation scheme that
captures high-level debate dynamics avoiding access to raw agent
reasoning content. RUMAD uses a multi-objective reward to model
solution quality, cohesion and efficiency. A PPO-trained controller
dynamically adjusts edge weights in the communication graph,
while a dual-threshold mechanism enables fine-grained control
over both agent activation and information visibility.
Experimental evaluation across MMLU, GSM8K, and GPQA bench-
marks demonstrates that RUMAD achieves substantial efficiency
gains—reducing token costs by over 80%—while still improving
reasoning accuracy compared to single LLM model and multiple
MAD baselines. Notably, RUMAD trained exclusively on MMLU
exhibits robust zero-shot generalization to out-of-domain (OOD)
tasks, indicating that the learned communication strategies capture
task-independent principles of effective multi-agent coordination.
These results establish RUMAD as a efficient and robust approach
for deploying multi-agent reasoning application with practical re-
source constraints.
KEYWORDS
Multi-agent Debate, LLM, Reinforcement Learning
This work is licensed under a Creative Commons Attribution Inter-
national 4.0 License.
Proc. of the 25th International Conference on Autonomous Agents and Multiagent Systems
(AAMAS 2026), C. Amato, L. Dennis, V. Mascardi, J. Thangarajah (eds.), May 25 – 29,
2026, Paphos, Cyprus.© 2026 International Foundation for Autonomous Agents and
Multiagent Systems (www.ifaamas.org). https://doi.org/10.65109/CBJO8409
ACM Reference Format:
Chao Wang, Han Lin, Huaze Tang, Huijing Lin, and Wenbo Ding. 2026.
RUMAD: Reinforcement-Unifying Multi-Agent Debate: AAAI Track. In
Proc. of the 25th International Conference on Autonomous Agents and Multia-
gent Systems (AAMAS 2026), Paphos, Cyprus, May 25 – 29, 2026, IFAAMAS,
13 pages. https://doi.org/10.65109/CBJO8409
1  INTRODUCTION
Multi-agent debate (MAD) frameworks harness the collective intelli-
gence of multiple large language models (LLMs) [1,5,6,9,13,21,25]
to achieve superior reasoning and decision-making beyond what
any single model can attain. However, the effectiveness and prac-
ticality of MAD systems fundamentally depend on how agents
communicate and exchange information during debate [11].
Adaptivity: Most existing MAD approaches utilize static sparse
topologies, such as Sparse MAD (S-MAD) [10], Group Debate (GD)
[12] or Selective Sparse MAD (S
2
-MAD) [22] using ring, star, or
fixed grouped/hierarchical structures, to reduce the communica-
tion burden compared to fully connected networks [4,8,19]. Such
methods inherently lack flexibility. Fixed topologies cannot adapt to
the evolving diversity, difficulty, or semantic style changes present
across different tasks (e.g., allocating the same budget to an easy
and a hard problem). As a result, they easily either cut off valuable
information paths for complex tasks or retain redundant, low-value
connections on simple tasks, ultimately hampering both efficiency
and collective reasoning.
Privacy: Some adaptive methods introduce external LLM-based
“judger” or “summarizer” roles, where a larger often more powerful
agent (e.g GPT-4) supervises the debate. Context within a debate
is exposed to external models. External knowledge in return sup-
presses the diversity and emergent collaboration of internal agent
swarm.
Efficiency:A  further  critical  limitation  of  existing  MAD  ap-
proaches is the lack of explicit modeling of token cost. Most previ-
ous MAD designs focus solely on accuracy or consensus, overlook-
ing the real-world computational and financial constraints imposed
by large-scale LLM deployments. Without a principled framework
for managing communication budgets, these systems either waste
arXiv:2602.23864v1  [cs.AI]  27 Feb 2026

Table 1: Different types of MAD methods are designed from different strategies. Mark•indicates corresponding metrics are
taken into design target. Mark◦indicates methods may have side-effect on corresponding metrics but don’t focus on them.
Mark - means methods fail on corresponding aspects.
Static Topology MethodsExternal-LLM Methods  RUMAD
Accuracy•••
Consensus◦••
External Opinion Independent•-•
Question Independent•-•
Communication Cost Control◦◦•
25
27
29
31
33
35
40
50
60
70
80
90
01020304050607080
▲
Accuracy (%)
●
■
Accuracy (%)
Average Token Cost (k/task)
Algorithms
●RUMAD
B=12
●RUMAD
B=18
●MAD
●S-MAD
∗
●S-MAD
◦
●GD
●S
2
MAD
MMLU:●GSM8K:■GPQA:▲
Figure 1: Comparison of accuracy and average token cost. Ac-
curacy for MMLU (•) and GSM8K (■) corresponds to the left
Y-axis, while GPQA (▲) corresponds to the right Y-axis. Points
closer to the top-left corner represent a superior accuracy-
efficiency trade-off. The results show that RUMAD variants
consistently outperform baselines by achieving higher accu-
racy at a lower token cost.
excessive resources or struggle to generalize under practical con-
straints. Static methods typically impose a hard upper bound on
communication rounds by restricting the debate topology.
Major challenges arise in balancing accuracy, diversity and ef-
ficiency(communication budget) of MAD, as show in Table 1. To
address these challenges, we propose RUMAD (Reinforcement-
Unifying Multi-Agent Debate), a novel framework that formu-
lates dynamic agent coordination and topology control as a rein-
forcement learning (RL) problem, without external LLM utilization.
RUMAD formulates dynamic communication topology control
as a reinforcement learning (RL) problem that is fundamentally
independent of debate content. Specifically, we represent the com-
munication topologies among agents as a dynamic weighted di-
rected graph, where a non-LLM RL agent dynamically adjusts the
edge weights in response to the evolving debate context. Crucially,
the RL controller is content-agnostic: it does not intervene in
the reasoning process or rely on privileged knowledge, but in-
stead observes high-level structural dynamics such as semantic
similarity scalars, answer agreement, debate progress, and commu-
nication cost. By modeling observations in this manner, RUMAD
preserves the neutrality of dynamic debate management and ef-
fectively mitigates the risk of introducing external opinions or
privileged information into the reasoning process.
RUMAD constructs a multi-objective reward function that ex-
plicitly balances accuracy, consensus, and token efficiency, while
strictly enforcing communication budget constraints. We employ
the PPO algorithm to train the topology control agent, which can
achieve these trade-offs after only lightweight training. More impor-
tantly, the content-agnostic and neutral design of RUMAD endows
it with strong zero-shot generalization capability, enabling robust
performance across diverse tasks and domains without the need
for task-specific finetuning.
Our experiments on standard benchmarks, including MMLU [7],
GSM8K [3], and GPQA [16], demonstrate that RUMAD achieves a
superior balance between collective accuracy and token usage com-
pared to both fully-connected and static sparse baselines. As shown
in Figure 1, take GSM8K for example, RUMAD
퐵=12
requires only
0.121k tokens per percentage point of accuracy, and RUMAD
퐵=18
requires 0.195k, compared to the 0.354k tokens required by the
second-best baseline (GD). Concretely, RUMAD reduces token cost
by 80% while improving accuracy on MMLU, and robustly general-
izes to new tasks (GPQA, GSM8K) with similar performance.
Our contributions are summarized as follows:
•We propose RUMAD, a novel reinforcement learning frame-
work that dynamically controls multi-agent debate topolo-
gies to optimize both accuracy and efficiency.
•We design a unified, content-agnostic observation and re-
ward scheme that enables robust and generalizable learning
of communication strategies across tasks and agent configu-
rations.
•We empirically demonstrate that RUMAD outperforms both
fully connected and static sparse MAD baselines, achiev-
ing superior trade-offs between performance and cost on
multiple challenging benchmarks.
2  PRELIMINARIES
2.1  Multi-Agent Debate
Multi-agent debate (MAD) is an emergent paradigm for collective
reasoning, where multiple language model agents iteratively ex-
change their intermediate thoughts and conclusions in order to
reach a more accurate and robust consensus than any single agent

Welcome to the debate! 
Can you answer the follow-
ing question? <Problem>
D makes most sense since... 
Agent 3
Stage 1:
Independent Initialization
Stage 2.1:
Topology Generation
Context-agnostic
Observation
Policy
Network
μ
ij
σ
ij
Distributions
of Weights
N×N
Distirbution
Params
sample
[w
ij
]
N×N
Critical
Reference
Background
Sparse TopologySemantic Categories
N-1
1
__
w
ij
<τ
Σ
i≠j
  [Critical]    Agent k says...
 [Reference] Agent j says... 
    [ ··· ]              ···
+
System Prompts
Agent i
For each activated agent:
Stage 2.2: Interaction
Stage 3: Consensus Formation
After T rounds of Stage 2:
Majority Voting → Final Answer
Influence
Weights
B is the answer, because... 
Agent 1
···
···
The reason I choose A is... 
Agent 2
Answer: ...
Reason: ...
Invisible
<δ
Figure 2: The process pipeline of RUMAD. In the first stage, all agents gives the initial response. In the second stage, RUMAD
organizes topology in stage 2.1 and the selected agents debate with each other in stage 2.2. In the last stage, the final decision is
obtained via majority voting.
alone. A central research focus within MAD is the design of com-
munication topologies—that is, how agents share information and
interact across debate rounds.
Early studies typically employed fully connected topologies, al-
lowing all agents to access each other’s responses at every round.
However, such dense communication can be inefficient and costly,
particularly as the number of agents grows. To address this, subse-
quent works have explored various forms of sparse and structured
topologies. For instance, S-MAD [10] adopts fixed sparse patterns
such as rings (only adjacent agents are visible) or stars (only cen-
tric agent are visible), enabling each agent to communicate only
with a subset of neighbors, thereby reducing token consumption.
Other approaches, like Group Debate (GD) [12], partition agents
into static groups, which debate internally before group-level ag-
gregation. Similarly, two-stage topologies such as S
2
-MAD [22]
first organize local debates within small groups and then aggre-
gate results through a secondary global round if group opinions
differ. These strategies all aim to balance the trade-off consensus
formation, and computational efficiency.
2.2  Static Workflow Generation and Dynamic
Topology Control
Multi-agent debate (MAD) systems rely on efficient inter-agent
communication topologies. This challenge shares many similar-
ities with recent research about automatic generation of agent
workflows. such as MACNET [15], AFlow [24], and MaAS [23],
which primarily focus on optimizing the static workflow or agentic
pipeline. For example, MACNET analyzes the performance of pre-
defined static topologies (e.g., chain, mesh) . AFlow uses MCTS to
search for a single, optimal static workflow for a given task domain.
MaAS refines this by using a controller to select a single, query-
dependent static workflow at the beginning of a task. Despite above
advances, however, most existing multi-agent LLM frameworks
rely on static or manually specified topologies, which cannot adapt
to the dynamic needs or varying complexity of different tasks.
This motivates the development of adaptive and principled meth-
ods for controlling agent interactions. Reinforcement learning (RL)
is an end-to-end solution which is capable of both modeling and
scheduling temporal dynamics during debate. Hierarchical RL frame-
works like FMH [2] use multi-faceted rewards, where the objective
is semantic task decomposition via manager-worker subgoaling.
Our work addresses a fundamentally different problem. RUMAD
is not concerned with generating a static, task-level workflow. In-
stead, we focus on dynamic, round-by-round communication man-
agement within a debate. Our RL controller is invoked at each
step to adaptively reconfigure the communication graph based on
the evolving state of the debate (e.g., agent agreement, semantic
similarity). This allows RUMAD to achieve fine-grained efficiency,
such as pruning connections to agents that have already reached
consensus, a capability not present in static workflow models. Con-
sidering hierarchical reward modeling, RUMAD’s multi-objective
reward function is novel in its content-agnostic nature, balancing
the system-level trade-offs between solution quality, group cohe-
sion, and computational cost.
2.3  Markov Decision Process
A Markov Decision Process (MDP) is a mathematical framework
for modeling sequential decision-making problems, where an agent
interacts with an environment over discrete time steps. At each step,
the agent observes the current state, selects an action, and receives
a reward and a new state from the environment. The objective is to
find a policy that maximizes the expected cumulative reward [20].
In our multi-agent debate (MAD) setting, this framework allows the
controller to base its topology decisions solely on the observable
debate state at each round, ensuring a neutral and adaptive decision
process that does not require access to agents’ internal semantic
content.

2.4  Proximal Policy Optimization
Proximal Policy Optimization (PPO) [18] is a widely used reinforce-
ment learning algorithm for training policies in high-dimensional
and dynamic environments. PPO employs an actor-critic frame-
work, where a policy network proposes actions and a value net-
work estimates the expected return for each state. By optimizing
a clipped surrogate objective, PPO achieves stable and efficient
policy updates, and has demonstrated robust performance across
various sequential decision-making tasks. In our MAD framework,
the value network provides reliable estimates of the debate state’s
long-term potential, which in turn stabilizes and guides the learning
of RUMAD about adaptive topology control strategies. Additionally,
we design a multi-objective reward model to capture the diverse
goals of the debate process, and employ Generalized Advantage
Estimation (GAE) [17] to further improve learning efficiency and
convergence.
3  METHOD
We propose a reinforcement learning (RL) framework for adaptive
topology control in multi-agent debate (MAD), in which a central-
ized controller dynamically regulates inter-agent communication to
maximize collective reasoning performance under communication
constraints. Our approach is characterized by the following inno-
vations: (1) a content-agnostic observation scheme that leverages
only interaction-relevant features without accessing agent-level
semantics, (2) a multi-objective reward formulation balancing accu-
racy, consensus, efficiency, and sparsity, (3) a soft and differentiable
action space modeling each edge’s communication weight as a
stochastic variable, and (4) a dual mechanism for communication
efficiency combining budget constraints and agent pruning. The
full pipeline consists of three stages: initial independent agent rea-
soning, iterative topology-controlled sparse debate, and consensus
aggregation via majority voting.
3.1  Framework Pipeline
To illustrate the operation process of RUMAD, we decompose our
framework into three sequential stages, each responsible for distinct
aspects of multi-agent debate, as show in Figure 2.
Stage 1: Independent Initialization.  All agents start by inde-
pendently generating their initial responses to the given problem.
Each agent푖produces an initial response푟
0
푖
and conclusion푐
0
푖
based
solely on the input prompt, without knowledge of other agents’
perspectives, ensuring diverse hypotheses that span the solution
space.
Stage 2: Adaptive Sparse Debate.  In this stage, agents itera-
tively interact under dynamically controlled topologies. We divide
the process into two focused steps:
(1)Topology Generation: The PPO policy network ingests the
current observations and outputs the influence weights푤
푡
푖푗
that determines how agents exchange information. Agents
with insufficient incoming influence will be masked and
reuse their previous responses to save tokens. Thus, we ob-
tain the active nodes and the directed edges with different
weights, which together constitute the interaction topology.
(2)Interaction: For each active agent푖, the debate environment
construct customized prompts by grouping neighbors into
categories based on weight magnitude (Critical, Reference,
Background, Invisible). This interaction step propagates in-
formation along pruned links, enabling focused debate under
a communication budget.
Stage 3: Consensus Formation.  After푇adaptive rounds, the
final conclusions{푐
푇
푖
}are aggregated via majority voting. The
consensus answer emerges as the label with the highest agent
support, reflecting the collective reasoning of the ensemble rather
than any single participant.
3.2  Content-Agnostic Observation
At each debate round푡, the controller observes a global state표
푡
constructed without reference to raw agent content. For each agent
푖, let푟
푡
푖
denote its reasoning embedding and푐
푡
푖
its current answer.
The embedded observable state for actor and critic is identically
defined by:
표
푡
= MLP(
[
sim(푖, 푗)
]
푁×푁
)(1)
where the푁 × 푁similarity matrix is given by MAD environment:
sim(푖, 푗)= 휆 cos(푟
푡
푖
,푟
푡
푗
)+(1− 휆) I(푐
푡
푖
=푐
푡
푗
)(2)
with hyperparameter휆 ∈ [0,1], cosine similaritycos(·,·)between
reasoning embeddings, andI(·)the indicator function for answer
agreement. The observation thus encodes only answer-level agree-
ment and high-level semantic structure, ensuring content-agnostic
control. RUMAD scheduler can only observe an푁 ×푁matrix with
floating-point similarity number within[0,1]without accessing
the raw text (nor embedding of text) of agent reasoning.
3.3  Action Space and Edge Weight Distribution
Modeling
In our framework, the action space at each debate round consists of
a set of continuous communication weights, where each possible
directed edge(푖, 푗)is assigned a real-valued weight푤
푡
푖푗
∈ (0,1)
reflecting the influence of agent푗on agent푖. To enable principled
policy optimization via stochastic gradient methods, we adopt a
probabilistic action parameterization: the policy network (actor)
outputs, for each edge, the parameters(휇
푡
푖푗
,휎
푡
푖푗
)of a Gaussian dis-
tribution, from which the edge weight is sampled as
푤
푡
푖푗
∼ Sigmoid
 
N(휇
푡
푖푗
, 휎
푡
푖푗
2
)

.(3)
This formulation satisfies the philosophy of PPO. The use of a
Gaussian distribution, followed by a Sigmoid transformation to
enforce the valid range, provides a flexible and fully differentiable
mechanism for modeling continuous actions. This allows for ef-
ficient exploration of the topology space, mitigates overfitting to
deterministic patterns, and enables robust credit assignment across
complex, high-dimensional action spaces. Such stochastic action pa-
rameterizations are standard in modern RL for continuous control
(e.g., PPO).
3.4  Communication Budget Constraint
To achieve joint optimization of reasoning accuracy and commu-
nication efficiency, we introduce a dual-threshold mechanism that

Question: To get to school in the morning, we ALL use this as our guide:
A) Rand-McNally Road Atlas, B) world globe, C) road map, D) mental map.
Correct: D
Round 0:
C
D
D
C
C
C
Token: 1,994; Majority: C; Correct: ✗.
Round 1:
C
D
D
D
C
C
Token: 2,254; Majority: C; Correct: ✗.
Round 2:
C
D
D
D
C
C
Token: 1,237; Majority: C; Correct: ✗.
Round 3:
C
D
D
D
D
D
Token: 2,499; Majority: D; Correct: ✓.
Round 4:
C
D
D
D
D
D
Token: 0;      Majority: D; Correct: ✓.
Round 5:
C
D
D
D
D
D
Token: 2,339; Majority: D; Correct: ✓.
Total token cost: 10,323; Final answer: D; Final Correctness: 
Figure 3: An example debate controlled by RUMAD.
directly links the learned edge weights to both token consumption
and semantic information flow within the debate process.
Specifically, at each round, the sampled weight matrix푊
푡
=
[푤
푡
푖푗
]
푁×푁
not only determines the semantic relevance of each neigh-
bor’s response for prompt construction (edge-wise), but also gov-
erns whether an agent actively updates its opinion (node-wise),
thereby incurring token cost.
For each agent푖, we compute its average external influence (in-
degree) as
 ̄
푤
푡
푖
=
1
푁 − 1
∑︁
푗≠푖
푤
푡
푖푗
,(4)
where푁is the total number of agents. An activation threshold휏
is applied: if
 ̄
푤
푡
푖
< 휏
, agent푖is pruned for the current round and
reuses its previous response. For simplicity, we utilize푤
푖푖
as activa-
tion threshold휏. The휏= 푤
푡
푖푖
design dynamically models implicit
"confidence" of each agent. An agent is confident enough while
assigned with higher weight on its own opinion than the average
of the external,
 ̄
푤
푡
푖
< 푤
푡
푖푖
. As shown by example round 4 in Figure 3,
it results in zero token usage this round that all agents are assigned
as confident. In the sub-sequential round 5, different weights are
sampled from distributions defined in Equation 3 thus more commu-
nication occurs. This threshold thus directly controls the expected
number of agents generating new tokens per round, providing a
fine-grained handle on collective communication expenditure.
The computed weights determine not only the influence strength
but also how information is presented to each agent. We implement
a three-tier prompt priority filter:
푃
푡
푖푗
=








[Critical]if 푤
푡
푖푗
> 0.40
[Reference]if 푤
푡
푖푗
> 0.25
[Background]    if 푤
푡
푖푗
> 0.10
(5)
Agents prioritize debate context with tags푃
푡
푖푗
quantized from com-
puted influence weights푤
푡
푖푗
, while maintaining the natural lan-
guage interaction paradigm of LLMs.
To regularize overall communication, we introduce a global bud-
get parameter퐵representing a soft upper bound on the total num-
ber of active communication links per round. Formally, the set of
active links is defined as{(푖, 푗):푤
푡
푖푗
> 훿}(where훿=0.10 as mini-
mum visible weight shown in Equation 5), and a budget penalty is
incorporated into the policy loss whenever this set exceeds 퐵:
L
budget
(휃)= max
 
0,
∑︁
푖,푗
I(푤
푡
푖푗
> 훿)− 퐵
!
,(6)
whereI(·)is the indicator function. Crucially,퐵acts as a training-
time prior via the loss function, encouraging the policy to in-
ternalize a preference for sparsity, rather than acting as a hard
constraint at inference. This budget constraint reflects a prior
preference for overall communication compactness, while leaving
the allocation of communication opportunities across agents to be
adaptively learned by the policy to best balance informativeness
and efficiency.
Through this budget-regularized design, RUMAD enables precise,
learnable trade-offs between debate effectiveness and communi-
cation cost, granting the controller the capacity to both minimize
unnecessary token usage and adaptively maintain critical informa-
tional flows.
3.5  Multi-Objective Reward
To guide the RL agent in navigating the complex trade-offs of debate,
we designed a hierarchical, multi-objective reward function. Our
design is structured around three core objectives:
Maximizing Solution Quality. As major rewarding signal,
Accuracy
푡/푒푝
are 0/1 binary rewards reflecting whether the ma-
jority answers match the ground truth.Progress
푡
applies a round-
driven-decaying reward amplification toAccuracy
푡
when round
answer is correct. Thus correctness in early-stage is encouraged.
Improvement
푡/푒푝
are also binary signals rewarding shift from wrong
answer to correct answer across adjacent rounds or between round
0 and final response.
Promoting Group Cohesion.Consensus
푡/푒푝
measures the pro-
portion of agent answers that match current majority answer, to-
gether with their semantic similarity, rewarding more unified and
coherent group responses.
Optimizing Resource Efficiency.Efficiency
푡
incentivizes re-
duced token consumption relative to a baseline answer-length bud-
get. In addition, a penalty signal,Sparsity
푡
, is designed as indicator
of "schedule expense". Expenses are assigned corresponding to se-
mantic magnitude filtered in Equation 5.
Formally, at each debate round푡, the controller receives a com-
posite reward 푅
푡
that integrates six key factors:
푅
푡
= 훼
1
Accuracy
푡
+ 훼
2
Consensus
푡
+ 훼
3
Progress
푡
(7)
+ 훼
4
Efficiency
푡
+ 훼
5
Improvement
푡
− 훼
6
Sparsity
푡
.
whereProgress
푡
andSparsity
푡
are designed as in-progress-only
signals. At the end of each debate episode, we compute a terminal
reward 푅
푒푝
:
푅
푒푝
= 훽
1
Accuracy
푒푝
+ 훽
2
Consensus
푒푝
(8)
+ 훽
3
Efficiency
푒푝
+ 훽
4
Improvement
푒푝

푅
푡
and푅
푒푝
are roughly homogeneous with different preference.
As shown in Table 5, parameters of푅
푡
and푅
푒푝
are distributed
similarly, exceptImprovement
푡
are emphasized with higher weight
in푅
푡
as encouragement of runtime adjustment. This two-tier reward
mechanism enables the controller to balance immediate step-wise
gains (e.g., rapid consensus or token savings) with ultimate debate-
level objectives, facilitating robust, generalizable policy learning for
efficient multi-agent reasoning under budget constraints. Structural
necessity of this hierarchical design is supported by ablation in
Section 4.3. And parameter robustness is shown through 0-shot
generalization revealed in Section 4.2.
3.6  RL Dynamic Topology Control
The controller is trained using the Proximal Policy Optimization
(PPO) framework. The policy loss is given by
L
휋
(휃)=−E
푡
h
min

푟
푡
ˆ
퐴
푡
, clip(푟
푡
, 1− 휀, 1+ 휀)
ˆ
퐴
푡
i
(9)
where푟
푡
=
휋
휃
(푎
푡
|표
푡
)
휋
휃
old
(푎
푡
|표
푡
)
is the probability ratio, and
ˆ
퐴
푡
is the advan-
tage computed via Generalized Advantage Estimation (GAE) using
the composite reward.
The PPO value network휙is trained to minimize the squared
error:
L
푣
(휙)= E
푡
h
(푉
휙
(표
푡
)−푉
target
푡
)
2
i
(10)
with푉
휙
(표
푡
)as predicted expectation of future return with current
observation표
푡
versus푉
target
푡
as the bootstrapped return at time step
푡 .
The total loss for joint PPO training is
L(휃,휙)=L
휋
(휃)+푐
1
L
푣
(휙)+푐
2
L
budget
(휃)(11)
where푐
1
,푐
2
≥0 balance loss signals among policy, value and regu-
larization into comparable orders of magnitude, according to PPO
style.
Training proceeds by iteratively sampling debate episodes, up-
dating the controller with the composite loss, and periodically eval-
uating performance under fixed communication budgets. At deploy-
ment, the controller deterministically selects edge weights using
the mean of the learned Gaussian distributions.
4  EXPERIMENTS
4.1  Experimental Setup
We conduct experiments on three challenging and complementary
benchmarks: MMLU [7], GSM8K [3], and GPQA [16]. The PPO-
based topology controller of RUMAD is exclusively trained on the
MMLU dev dataset, leveraging its broad coverage of multi-domain
reasoning tasks. Table 6 summarizes the training hyperparameter
settings used throughout our experiments. For evaluation, we report
results on the MMLU test set as well as on GSM8K (arithmetic
reasoning) and GPQA (graduate-level science QA). Notably, for
GSM8K and GPQA, we apply RUMAD controller in a zero-shot
transfer setting without any further fine-tuning, directly assessing
the generalization capability of the learned communication policy.
To maximize the heterogeneity and dynamic interactions within
the debate, we instantiate a diverse agent pool comprising three
different LLM models: LLaMA-3.1-8B-Instruct [21], ChatGLM-4-
9B [5], and Deepseek-Math-7B-Instruct [6]. Each architecture is
Table 2: Performance of RUMAD and baselines across three
evaluation datasets. Token cost is calculated as average of
each topic debated. (6,6) is general mark of MAD systems indi-
cating 6-agent, 6-round configuration. RUMAD significantly
reduces token cost with comparable or improved accuracy.
S-MAD with different structures are denoted as * (Star) and o
(Ring). Since RUMAD is trained upon MMLU dev partition,
MMLU test partition is used for evaluation. RUMAD eval-
uated upon GPQA-main and GSM8K is zero-shot migrated,
without any finetuning with new datasets. RUMAD shows su-
perior cross-domain generality. Note: All baseline accuracies
are measured under identical 4-bit quantization and 0-shot
settings for a fair comparison.
TaskMethod (6,6)  ACC
Token Cost
(k/task)
Cost
Saving
MMLU
RUMAD
퐵=12
68%11.43-81.74%
RUMAD
퐵=18
68%22.46-64.11%
MAD49%62.58N/A
S-MAD
∗
61%33.32-46.75%
S-MAD
◦
54%31.70-49.34%
GD53%32.17-48.59%
S
2
MAD46%25.36-58.48%
GPQA
RUMAD
퐵=12
32%19.53-66.21%
RUMAD
퐵=18
35%33.39-42.24%
MAD30%57.80N/A
S-MAD
∗
30%36.37-37.08%
S-MAD
◦
34%38.59-33.24%
GD34%26.05-54.93%
S
2
MAD28%23.26-59.76%
GSM8K
RUMAD
퐵=12
86%10.46-86.40%
RUMAD
퐵=18
89%17.28-77.53%
MAD88%76.90N/A
S-MAD
∗
83%39.38-48.78%
S-MAD
◦
70%37.82-50.81%
GD84%29.76-61.30%
S
2
MAD70%30.51-60.32%
represented by two agents, forming a six-member debate group per
trial. For each agent, there are 4 non-similar agents and 1 similar
agent. This multi-architecture composition is designed to capture a
spectrum of reasoning styles and knowledge bases.
For computational efficiency and scalability, all LLMs are de-
ployed  using 4-bit groupwise quantization (Q4_K_M)  with
mixed precision. Embedding model used for RUMAD to compute
similarity among texts, defined in Equation 2, is Nomic-Embed-
v1 [14]. This configuration enables concurrent inference of all
agents on a single NVIDIA GeForce RTX 3090 GPU, facilitating
systematic ablation and large-scale evaluation. Thus, an efficiency-
focused 0-shot, 4-bit setup is crucial for fair baseline comparison.
For instance, the LLaMA-3.1-8B-Instruct is officially reported with
69.4% accuracy on MMLU under 5-shot, bf16-precision condi-
tions, while actually achieving 57.9% under 0-shot, 4-bit setting.

We benchmark RUMAD primarily against MAD, a fully-connected
debate protocol that omits both visibility control and prompt struc-
turing, thereby preserving complete information exchange among
all agents throughout the discussion. In addition, we evaluate against
S-MAD, GD, and S
2
-MAD using each method’s reported optimal
configuration.
Our evaluation focuses on two key metrics: (1) solution accuracy
across diverse problem categories, and (2) computational efficiency
as measured by total token consumption. And we evaluate general-
ity of RUMAD by comparing its performance across different bench-
marks. Scripts for training and evaluating, along with RUMAD PPO
checkpoint weight files, will be provided in supplementary files.
4.2  Results and Analysis
As shown in Table 2, our proposed RUMAD framework achieves a
substantial reduction in communication cost while maintaining, or
even enhancing, answer accuracy across all evaluated benchmarks.
On both MMLU and GSM8K, RUMAD reduces average token us-
age per task by over 80% compared to the fully connected MAD
baseline, yet achieves much better accuracy (e.g., 68% vs 49% on
MMLU). RUMAD also provides best token cost saving on GPQA,
while higher accuracy is available if assigned more communication
budget (12 to 18 times per round). This demonstrates the efficacy of
reinforcement learning-based dynamic topology control of RUMAD
in identifying and preserving the most informative agent interac-
tions under tight communication budgets. The results highlight
that significant efficiency gains are attainable without sacrificing
group reasoning performance.
퐵as configurable prior budget.  A salient advantage of our
framework lies in the explicit budget parameter퐵utilized in budget
loss defined in Equation 6, which directly governs the maximum
expected communication load per round. By adjusting퐵, practi-
tioners can specify a clear prior on resource consumption, aligning
debate efficiency with practical deployment constraints. Our results
show that even at relatively low budget levels (e.g.,퐵=12 for six
agents), the controller learns to allocate communication judiciously,
maintaining high accuracy with a fraction of the original token
cost.
We configured a comparison with퐵=18, indicating user prior
preference is communication of 3 times per agent per round in
identical 6-agent system. RUMAD is capable to allocate this budget
adaptively and get higher accuracy performance on all benchmarks,
with corresponding trade-off on token-cost. This interpretability
and controllability of퐵enhances the usability of our approach in
real-world multi-agent systems. As we can see, on MMLU tasks,
퐵=12 budget is sufficient for RUMAD to coordinate debate and
achieve comparable accuracy with퐵=18 budget (68.30% vs 68.48%),
while on GPQA and GSM8K, RUMAD utilize more budget to provide
better performance.
As defined in Equation 6,퐵acts as a training-time prior via
the loss function, encouraging the policy to internalize a preference
for sparsity, rather than a hard constraint at inference applied
to scheduler. Utilization of퐵provides better alignment of human
prior preference without increasing cost of hyperparameter tuning.
Table 3: Ablation study of RUMAD’s key components. We
report accuracy (ACC, %) and average token cost (TC, in k/-
task). The best result for each metric is in bold. We set퐵=12
for all variants.
Ablation Module
MMLUGPQAGSM8K
ACC  TC  ACC  TC  ACC  TC
RUMAD68.3  11.4  31.9  19.5  86.4  10.5
훽 distribution65.118.729.228.784.517.2
w/o 푅
푒푝
66.915.631.024.485.114.3
w/o 푅
푡
67.222.230.132.686.020.2
w/o agent activation65.451.931.767.586.145.0
w/oL
budget
70.017.427.726.885.815.6
RUMAD zero-shot generality.  We observe that the RUMAD
controller, trained solely on the MMLU development set, gener-
alizes robustly to out-of-domain benchmarks such as GPQA and
GSM8K in a zero-shot setting. It’s notable that MMLU is single-
choice task while GSM8K needs arithmetic answers. Despite no
exposure to these domains during training, RUMAD maintains
competitive accuracy and cost savings, underscoring the general-
ity and transferability of the learned communication policy. This
strong out-of-domain performance also serves as key evidence of
hyperparameter robustness. The same model trained on MMLU
under reward model with parameter훼
푘
,훽
푘
transferred directly to
GSM8K and GPQA without modification, indicating the learned
policy is not brittle or overfitted to the training domain, a com-
mon concern with complex reward structures. This result suggests
that our method is not tightly coupled to any single task distribu-
tion or agent type, facilitating practical deployment across diverse
collaborative reasoning scenarios.
4.3  Ablation Study
We conduct a comprehensive ablation study to investigate the
contribution of each key component of RUMAD. To ensure a fair
comparison, all variants are trained exclusively on the MMLU dev
dataset and operate under a consistent 6-agent, 6-round configura-
tion. The results, summarized in Table 3, are evaluated on MMLU,
GPQA, and GSM8K, reporting both accuracy and average token
cost. The findings demonstrate that each module is integral to the
model’s performance, and the full RUMAD framework achieves the
best overall trade-off between accuracy and efficiency.
Change to훽distribution.  RUMAD models agent connections
using a Gaussian distribution to avoid overfitting. Replacing this
with a훽distribution results in a significant performance drop: accu-
racy falls across all benchmarks (e.g., 68.3% to 65.1% on MMLU), and
the token cost substantially increases, underscoring the superior
modeling capability of the Gaussian parameterization.
Ablation of푅
푒푝
and푅
푡
.  Our two-tier reward system is criti-
cal for balancing immediate and long-term goals. It combines the
per-round reward푅
푡
with an episode reward푅
푒푝
applied only at
the final round. In thew/o푅
푒푝
variant, we replace the final round’s
푅
푒푝
with the standard푅
푡
, which causes a notable drop in accuracy

Table 4: Scalability analysis with varying agent numbers. We
report Accuracy (ACC) and average Token Cost (TC, k/task)
on MMLU and GSM8K.
Agents (푁 )  Budget (퐵)
MMLUGSM8K
ACC   TC   ACC   TC
3666.6%2.385.0%2.0
61268.3%11.486.4%10.5
61868.5%22.5  88.6%17.3
91870.3%17.688.5%15.9
and a∼37% increase in token cost on MMLU (11.4k to 15.6k). Con-
versely, in the w/o푅
푡
variant, we broadcast the final푅
푒푝
value to
all preceding rounds. This results in a severe impact on efficiency,
nearly doubling the token cost. This highlights that both reward
signals are necessary for learning an efficient policy.
Ablation of agent activation.  The agent activation mechanism
is paramount for efficiency. It conditionally decides if an agent gen-
erates a new response, enabling true communication sparsification.
Removing it (w/o agent activation) means that even with efficient
pruning of communication edges, all agents are still forced to gen-
erate a new response in every round. This inability to dynamically
silence agents causes a catastrophic increase in token cost (e.g., a
∼4.5x increase on MMLU), while accuracy also suffers. This con-
firms that dynamic agent activation, not just edge pruning, is the
primary driver of RUMAD’s token savings.
Ablation ofL
budget
.  The budget lossL
budget
acts as a crucial
regularizer for both efficiency and generalization. Without it, the
controller fails to converge to an efficient policy, incurring higher
token costs. Interestingly, while this variant achieves higher accu-
racy on the in-domain MMLU task (70.0%), its performance drops
significantly on the out-of-domain benchmarks GPQA (27.7% vs.
31.9%) and GSM8K (85.8% vs. 86.4%). This strongly suggests that
L
budget
not only enforces efficiency but also guides the RL algorithm
to learn more generalizable communication strategies.
4.4  Scalability Analysis
We investigate RUMAD’s scalability and robustness by evaluating
its performance across varying agent group sizes (푁 ∈ {3,6,9}) and
budgets (퐵 ∈ {6,12,18}), with results summarized in Table 4. For a
fair comparison, all hyperparameters except퐵(e.g., learning rate,
reward coefficients) are kept identical, demonstrating the model’s
robustness.
First, the results demonstrate a clear positive correlation between
the number of agents and reasoning performance. When scaling
the agent count푁and communication budget퐵proportionally
(푁 ∈ {3,6,9}while퐵=2× 푁), we observe consistent improve-
ments in accuracy—rising from 66.6% to 70.3% on MMLU and from
85.0% to 88.5% on GSM8K. This trend indicates that RUMAD effec-
tively harnesses the increased diversity and collective intelligence
of larger groups. While the token cost naturally increases with the
number of agents, the framework remains efficient relative to the
performance gains.
A more compelling insight emerges when scaling the agent pool
under a fixed budget. By increasing the agent count from푁=6 to
푁=9 while keeping the budget at퐵=18, we observe a simultane-
ous increase in MMLU accuracy (68.5%→70.3%) and a significant
decrease in token cost for both benchmarks (e.g., 22.5k→17.6k
on MMLU). This counter-intuitive result strongly demonstrates
the adaptability of our RL controller. Given a larger pool of agents,
the controller learns to allocate its fixed budget more judiciously,
selecting a more specialized or diverse subset of agents to partic-
ipate. This intelligent selection leads to a more efficient path to
the solution, enhancing performance while reducing redundant
communication.
Across experiments upon different swarm, RUMAD shows stable
ability to find a more efficient and accurate policy without requiring
extensive hyperparameter tuning. It suggests RUMAD learns a
generalizable communication policy rather than overfitting to a
specific setup, highlighting its hyperparameter insensitivity and
flexibility for deployment in diverse environments.
5  CONCLUSION
This paper introduces RUMAD, a principled reinforcement learning
framework for adaptive topology control in multi-agent debate
systems. By leveraging a content-agnostic observation design and
a multi-objective reward scheme, RUMAD enables dynamic, effi-
cient, and neutral management of agent interactions—successfully
balancing accuracy, consensus, and computational efficiency un-
der strict communication budgets. RUMAD also exhibits robust
zero-shot generalization to diverse tasks and domains, showcasing
strong transferability and practical deployment potential. Exten-
sive experiments across MMLU, GSM8K, and GPQA demonstrate
that RUMAD reduces token consumption by over 80% compared
to fully connected baselines, while maintaining or even improving
collective reasoning accuracy against all baselines.
These results establish RUMAD as a promising solution for scal-
able, cost-effective multi-agent reasoning, and open avenues for
future research on principled coordination and communication
mechanisms in large-scale multi-agent systems. While RUMAD
demonstrates strong performance, we acknowledge existing limi-
tations. The centralized PPO controller, while efficient for typical
MAD groups (6-8 agents), may face scalability challenges in scenar-
ios with hundreds of agents. Future exploration about decentralized
or hierarchical Multi-agent RL controllers is worth studying.
ACKNOWLEDGMENTS
This work was supported by Shenzhen Science and Technology
Program (No. KJZD20240903100905008).
REFERENCES
[1]Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ahmad, Ilge Akkaya, Floren-
cia Leoni Aleman, Diogo Almeida, Janko Altenschmidt, Sam Altman, Shyamal
Anadkat, et al. 2023. GPT-4 technical report.
[2]Sanjeevan Ahilan and Peter Dayan. 2019.  Feudal Multi-Agent Hierarchies for
Cooperative Reinforcement Learning.   https://doi.org/10.48550/arXiv.1901.08492
arXiv:1901.08492 [cs]
[3]Karl Cobbe, Vineet Kosaraju, Mohammad Bavarian, Mark Chen, Heewoo Jun,
Lukasz Kaiser, Matthias Plappert, Jerry Tworek, Jacob Hilton, Reiichiro Nakano,
et al. 2021. Training verifiers to solve math word problems.
[4]Yilun Du, Shuang Li, Antonio Torralba, Joshua B Tenenbaum, and Igor Mordatch.
2023. Improving factuality and reasoning in language models through multiagent

debate.
[5]Team GLM, Aohan Zeng, Bin Xu, Bowen Wang, Chenhui Zhang, Da Yin, Dan
Zhang, Diego Rojas, Guanyu Feng, Hanlin Zhao, et al.2024. Chatglm: A family
of large language models from glm-130b to glm-4 all tools.
[6]Daya Guo, Dejian Yang, Haowei Zhang, Junxiao Song, Ruoyu Zhang, Runxin
Xu, Qihao Zhu, Shirong Ma, Peiyi Wang, Xiao Bi, et al.2025.   Deepseek-r1:
Incentivizing reasoning capability in llms via reinforcement learning.
[7]Dan Hendrycks, Collin Burns, Steven Basart, Andy Zou, Mantas Mazeika, Dawn
Song, and Jacob Steinhardt. 2020. Measuring massive multitask language under-
standing.
[8]Jennifer Hill, W Randolph Ford, and Ingrid G Farreras. 2015.  Real conversa-
tions with artificial intelligence: A comparison between human–human online
conversations and human–chatbot conversations. , 245–250 pages.
[9]Juyong Jiang, Fan Wang, Jiasi Shen, Sungju Kim, and Sunghun Kim. 2024.  A
Survey on Large Language Models for Code Generation.
[10]Yunxuan Li, Yibing Du, Jiageng Zhang, Le Hou, Peter Grabowski, Yeqing Li, and
Eugene Ie. 2024.  Improving Multi-Agent Debate with Sparse Communication
Topology.
[11]Tian Liang, Zhiwei He, Wenxiang Jiao, Xing Wang, Yan Wang, Rui Wang, Yujiu
Yang, Shuming Shi, and Zhaopeng Tu. 2023. Encouraging divergent thinking in
large language models through multi-agent debate.
[12]
Tongxuan Liu, Xingyu Wang, Weizhe Huang, Wenjiang Xu, Yuting Zeng, Lei
Jiang, Hailong Yang, and Jing Li. 2024. Groupdebate: Enhancing the efficiency of
multi-agent debate using group discussion.
[13]Humza Naveed, Asad Ullah Khan, Shi Qiu, Muhammad Saqib, Saeed Anwar,
Muhammad Usman, Naveed Akhtar, Nick Barnes, and Ajmal Mian. 2023.   A
comprehensive overview of large language models.
[14]
Zach Nussbaum, John X. Morris, Brandon Duderstadt, and Andriy Mulyar. 2025.
Nomic Embed: Training a Reproducible Long Context Text Embedder.   https:
//doi.org/10.48550/arXiv.2402.01613 arXiv:2402.01613 [cs]
[15]Chen Qian, Zihao Xie, YiFei Wang, Wei Liu, Kunlun Zhu, Hanchen Xia, Yufan
Dang, Zhuoyun Du, Weize Chen, Cheng Yang, Zhiyuan Liu, and Maosong Sun.
2025. Scaling Large Language Model-based Multi-Agent Collaboration.   https:
//doi.org/10.48550/arXiv.2406.07155 arXiv:2406.07155 [cs]
[16]
David Rein, Betty Li Hou, Asa Cooper Stickland, Jackson Petty, Richard Yuanzhe
Pang, Julien Dirani, Julian Michael, and Samuel R. Bowman. 2023.  GPQA: A
Graduate-Level Google-Proof Q&A Benchmark.   https://doi.org/10.48550/arXiv.
2311.12022 arXiv:2311.12022 [cs]
[17]
John Schulman, Philipp Moritz, Sergey Levine, Michael Jordan, and Pieter Abbeel.
2018.   High-Dimensional Continuous Control Using Generalized Advantage
Estimation.   https://doi.org/10.48550/arXiv.1506.02438 arXiv:1506.02438 [cs]
[18]John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, and Oleg Klimov.
2017. Proximal Policy Optimization Algorithms.   https://doi.org/10.48550/arXiv.
1707.06347 arXiv:1707.06347 [cs]
[19]Qiushi Sun, Zhangyue Yin, Xiang Li, Zhiyong Wu, Xipeng Qiu, and Lingpeng
Kong. 2023. Corex: Pushing the boundaries of complex reasoning through multi-
model collaboration.
[20]Richard S. Sutton and Andrew G. Barto. 2018. Reinforcement Learning: An Intro-
duction. A Bradford Book, Cambridge, Massachusetts.
[21]Hugo Touvron, Louis Martin, Kevin Stone, Peter Albert, Amjad Almahairi, Yas-
mine Babaei, Nikolay Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti Bhos-
ale, et al. 2023. Llama 2: Open foundation and fine-tuned chat models.
[22]Yuting Zeng, Weizhe Huang, Lei Jiang, Tongxuan Liu, Xitai Jin, Chen Tianying
Tiana, Jing Li, and Xiaohua Xu. 2025. S
2
-MAD: Breaking the Token Barrier to
Enhance Multi-Agent Debate Efficiency.
[23]Guibin Zhang, Luyang Niu, Junfeng Fang, Kun Wang, Lei Bai, and Xiang Wang.
2025. Multi-Agent Architecture Search via Agentic Supernet.   https://doi.org/10.
48550/arXiv.2502.04180 arXiv:2502.04180 [cs]
[24]Jiayi Zhang, Jinyu Xiang, Zhaoyang Yu, Fengwei Teng, Xionghui Chen, Jiaqi Chen,
Mingchen Zhuge, Xin Cheng, Sirui Hong, Jinlin Wang, Bingnan Zheng, Bang
Liu, Yuyu Luo, and Chenglin Wu. 2025. AFlow: Automating Agentic Workflow
Generation.   https://doi.org/10.48550/arXiv.2410.10762 arXiv:2410.10762 [cs]
[25]Wayne Xin Zhao, Kun Zhou, Junyi Li, Tianyi Tang, Xiaolei Wang, Yupeng Hou,
Yingqian Min, Beichen Zhang, Junjie Zhang, Zican Dong, et al.2023. A survey
of large language models.

A  DETAILED HYPER PARAMETERS
This section lists a detailed configuration of hyper parameters used in RUMAD framework.
Table 5: Weight parameter used in RUMAD multi-objective reward functions.
SymbolDescriptionValue
훼
1
/훽
1
Accuracy1.0/2.0
훼
2
/훽
2
Consensus0.3/0.5
훼
3
Progress0.1
훼
4
/훽
3
Efficiency0.2/0.3
훼
5
/훽
4
Improvement1.0/0.2
훼
6
Sparsity (penalty)0.1
Table 6: Training hyperparameters used for the PPO-based topology controller of RUMAD.
SymbolDescriptionValue
푑
ℎ
Hidden layer dimension128
훼Learning rate1× 10
−4
훾Discount factor0.99
휆GAE parameter0.95
휀Policy clipping threshold0.20
푐
1
Value loss coefficient0.01
푐
2
Budget penalty coefficient0.01
퐸Update epochs per rollout1
푏Batch size per update10
퐿Rollout length10
B  DETAILED DEBATE INSTANCE
This section provides a detailed, step-by-step trace of a specific debate process for a multiple-choice question, which is visually summarized
in Figure 3 of the main text. The problem statement and the correct option are as follows.
{
"question ": "To get to  school  in the  morning , we ALL  use  this as our  guide: A) Rand -McNally  Road
Atlas., B) world  globe., C) road  map., D) mental  map..",
"correct ": "D"
}
B.1  Independent Initialization
In Round 0, all six agents ({0,1,2,3,4,5}) execute the "Starting" prompt independently (see Table 8) to generate their initial responses to the
problem. The generated responses from 3 different types of LLMs (see Section 4.1) are shown below.
{

"Agent  0": "A question  that  gets to the  heart  of  daily  routines! To get to  school  in the  morning ,
most  people  use a mental  map (D) as  their  guide. A mental  map is a cognitive  representation  of a
person's knowledge  about  the  layout  of  their  surroundings , including  the  location  of schools ,
homes , and  other  familiar  places. It's a mental  construct  that is  developed  through  repeated
experiences  and  exposure  to the  environment. While  options A, B, and C are  all  valid  tools  for
navigating , they  are  not  typically  used as a guide  for  getting  to  school  in the  morning. Rand -
McNally  Road  Atlas (A) is a physical  book  that  provides  detailed  maps of  roads  and  highways , but
it's not  something  that  people  typically  carry  with  them on a daily  basis. A world  globe (B) is a
decorative  item  that  shows  the Earth's surface , but it's not a practical  tool  for  getting  to
school. A road  map (C) is a more  portable  version  of a road  atlas , but it's still  not  something
that  people  typically  use as a guide  for  getting  to  school. In contrast , a mental  map is a
flexible  and  dynamic  representation  of a person's knowledge  about  their  surroundings. It's
something  that  people  develop  through  repeated  experiences  and  exposure  to the  environment , and
it's not  something  that  can be  easily  replaced  with a physical  map or  atlas. Therefore , the
correct  answer  is: \\ boxed{D) mental  map.}",
"Agent  1": "The  answer  is $\\ boxed{C}$."
"Agent  2": "The  most  accurate  answer  to the  question  of what is used as a guide  to get to  school  in
the  morning  is: D) mental  map. A mental  map is an  individual's internal  representation  of  their
environment , which  includes  knowledge  of locations , routes , and  spatial  relationships. When
people  navigate  to school , they  typically  rely on  their  own  mental  maps  rather  than  external
tools  like  road  maps or  atlases. While a road  map (C) could  be used to plan a route , it is not
the  primary  guide  used  during  the  actual  navigation  process. A world  globe (B) is a three -
dimensional  representation  of the  Earth  and is not  practical  for  daily  navigation. A Rand -McNally
Road  Atlas (A) is a physical  map  that  could  be used  for  planning , but it is not as  commonly  used
for real -time  navigation  as a mental  map. \\ boxed{D}"
}
B.2  Adaptive Sparse Debate
The RUMAD framework proceeds through several debate rounds, where agents selectively update their responses based on the collective
solutions shared from the previous round.
In Round 1, Agents 0, 1, 4, and 5 reuse their previous responses. Agents 2 and 3, however, generate new responses using the "Debate"
prompt, incorporating and analyzing the solutions shared from Round 0. The generated responses are as follows.
{
"Agent  2": "To  provide  an  updated  answer , let's examine  the  responses  from  the  num_agents  step by
step: 1.  Agent 0 and  Agent 3 both  argue  for  the  mental  map (D) as the  primary  guide  for  getting
to  school  in the  morning. They  emphasize  that a mental  map is a cognitive  representation
developed  through  repeated  experiences  and is not  easily  replaced  by  physical  maps or  atlases. 2.
Agent 1 and  Agent 4 suggest  that  the  road  map (C) is the  correct  answer. However , their
arguments  are  not as  detailed  as  those  of  Agents 0, 2, and 3, and  they do not  provide a clear
explanation  as to why a road  map is the  primary  guide. 3.  Agent 2 also  supports  the  mental  map (D
) as the  correct  answer. They  provide a similar  rationale  to  Agents 0 and 3, emphasizing  the
individual's internal  representation  of the  environment  and  the  impracticality  of  using  external
tools  like  road  maps or a world  globe  for  daily  navigation. Given  the  detailed  and  consistent
support  for  the  mental  map (D) from  Agents 0, 2, and 3, and  the  lack of a compelling  argument
from  Agents 1 and 4, the  most  robust  and  persuasive  answer  is: \\ boxed{D) mental  map .}"
"Agent  3": "After  reviewing  the  responses  from  the  other  agents , I agree  that  the  most  accurate
answer  to the  question  of what is used as a guide  to get to  school  in the  morning  is  indeed: \\
boxed{D) mental  map.} The  arguments  presented  by  Agents 2, 3, and 5 are  all  consistent  and well -
reasoned , highlighting  the  importance  of  mental  maps in  daily  navigation. They  correctly  point
out  that  mental  maps  are  internal  representations  of the  environment , developed  through  repeated
experiences  and  exposure , and  are  more  practical  and  flexible  than  external  tools  like  road  maps
or  atlases. While  Agents 1 and 5 did  not  provide  detailed  explanations , their  answers  still
indicate  that  they  believe  the  correct  answer  is D) mental  map. In  conclusion , based  on the
collective  responses , I firmly  believe  that  the  most  accurate  answer  is: \\ boxed{D) mental  map .}"
}
In Round 2, Only Agent 5 generates a new response, while all other agents reuse their previous solutions. The response of agent 5 is as
follows.
{

"Agent  5": "After  examining  the  responses  from  Agents 0, 2, 3, 4, and 5, it is  clear  that  there  is a
strong  consensus  in  favor  of the  mental  map (D) as the  primary  guide  for  getting  to  school  in the
morning. Here's a step -by -step  analysis  of the  arguments: - Agent 0 provides a clear  explanation
of what a mental  map is and  why it is the  most  practical  guide  for  daily  navigation , such as
going  to  school. - Agent 2 summarizes  the  arguments  from  Agents 0, 2, and 3, reinforcing  the  idea
that  the  mental  map is the  most  persuasive  answer  due to its  individual  development  and
practicality. - Agent 4 offers a different  perspective , suggesting  that  the  road  map (C) is the
correct  answer. However , this  argument  is not as  detailed  or  persuasive  as the  ones  presented  by
Agents 0, 2, and 5. - Agent 5 provides a comprehensive  analysis , agreeing  with  Agents 0, 2, and 3
that  the  mental  map (D) is the  most  accurate  answer. They  also  explain  why  the  other  options (A,
B, and C) are  not as  suitable  for  daily  navigation. Given  the  detailed  and  consistent  support
for  the  mental  map (D) from  Agents 0, 2, 3, and 5, and  the  lack of a compelling  argument  from
Agent 4, the  most  robust  and  persuasive  answer  is: \\ boxed{D) mental  map .}"
}
In Round 3, Agents 2, 3, 4, and 5 reuse their previous solutions, while Agents 0 and 1 generate new responses based on the updated
collective solutions, which are as follows.
{
"Agent  0": "After  examining  the  responses  from  the  num_agents  step by step , I agree  with  the
consensus  that  the  most  accurate  answer  is: \\ boxed{D) mental  map.} The  arguments  presented  by
Agents 0, 2, 3, and 5 are  all  consistent  and well -reasoned , highlighting  the  importance  of  mental
maps in  daily  navigation. They  correctly  point  out  that  mental  maps  are  internal  representations
of the  environment , developed  through  repeated  experiences  and  exposure , and  are  more  practical
and  flexible  than  external  tools  like  road  maps or  atlases. While  Agents 1 and 4 did  not  provide
detailed  explanations , their  answers  still  indicate  that  they  believe  the  correct  answer  is D)
mental  map. In  conclusion , based  on the  collective  responses , I firmly  believe  that  the  most
accurate  answer  is: \\ boxed{D) mental  map.}",
"Agent  1": "After  examining  the  responses  from  the  other  agents , I agree  that  the  most  accurate
answer  to the  question  of what is used as a guide  to get to  school  in the  morning  is  indeed: The
answer  is $\\ boxed{D}$."
}
In Round 4, all six agents reuse their previous responses, leading to no new responses being generated.
In Round 5, only Agents 0 and 2 generate updated responses which are as follows, further reinforcing the consensus reached in the
previous rounds.
{
"Agent  0": "After  examining  the  responses  from  the  other  agents , I agree  that  the  most  accurate
answer  to the  question  of what is used as a guide  to get to  school  in the  morning  is  indeed: The
arguments  presented  by  Agents 0, 2, 3, and 5 are  all  consistent  and well -reasoned , highlighting
the  importance  of  mental  maps in  daily  navigation. They  correctly  point  out  that  mental  maps  are
internal  representations  of the  environment , developed  through  repeated  experiences  and  exposure ,
and  are  more  practical  and  flexible  than  external  tools  like  road  maps or  atlases. While  Agents
1 and 4 did  not  provide  detailed  explanations , their  answers  still  indicate  that  they  believe  the
correct  answer  is D) mental  map. In  conclusion , based  on the  collective  responses , I firmly
believe  that  the  most  accurate  answer  is: \\ boxed{D) mental  map.}",
"Agent  2": "After  carefully  examining  the  responses  from  Agents 0, 2, 3, 4, and 5, it is  evident  that
there  is a strong  consensus  supporting  the  mental  map (D) as the  primary  guide  for  daily
navigation , such as  getting  to  school  in the  morning. - Agent 0 provides a comprehensive
explanation  of the  concept  of a mental map , emphasizing  its  role as an  internal  representation  of
the  environment  developed  through  repeated  experiences. This  internal  guide  is  deemed  more
practical  and  flexible  than  external  tools  like  road  maps or  atlases. - Agent 2 reinforces  the
argument  for  the  mental  map by  summarizing  the  points  made by  Agents 0, 2, and 3, further
solidifying  the  case  for  its  practicality  and  individual  development. - Agent 3 adds to the
argument  by  highlighting  the  cognitive  aspect  of  mental  maps , which  are  not  easily  replaced  by
physical  maps or atlases , making  them  ideal  for  daily  navigation. - Agent 4 presents a
contrasting  view , suggesting  that  the  road  map (C) is the  correct  answer. However , this  argument
lacks  the  depth  and  detail  of the  mental  map  explanation  provided  by  Agents 0, 2, 3, and 5. -
Agent 5 offers a comprehensive  analysis , agreeing  with  the  mental  map  argument  and  explaining  why
the  other  options  are  less  suitable  for  daily  navigation. Given  the  detailed  and  consistent
support  for  the  mental  map (D) from  Agents 0, 2, 3, and 5, and  the  lack of a compelling  argument
from  Agent 4, the  most  robust  and  persuasive  answer  is: \\ boxed{D) mental  map .}"

}
Following the completion of the adaptive debate rounds, the final aggregated conclusion, "D) mental map.", is determined via majority
voting among all agents.
C  PROMPT CONFIGURATION
This section details the system and stage-specific prompts used to configure the RUMAD framework for the experiments. Table 7 outlines the
specific output format requirements for the various datasets used, and Table 8 lists the prompts utilized in each stage of the debate process.
Table 7: Output format requirements across different tasks.
TaskOutput Format Requirements
MMLU & GPQAPut your final choice in the form \boxed{{answer}} at the end of your response.
GSM8KYour final answer should be a single numerical number, in the Form \boxed{{answer}}, at the end of your response.
Table 8: Prompts used in each stage of the debate.
TypeTask  Prompt
SystemAllWelcome to the debate! You are a seasoned debater with expertise in succinctly and persuasively expressing your
viewpoints. You will be assigned to debate groups, where you will engage in discussions with fellow participants.
The outcomes of each group’s deliberations will be shared among all members. It is crucial for you to leverage this
information effectively in order to critically analyze the question at hand and ultimately arrive at the correct answer.
Best of luck!
StartingAllCan you answer the following question as accurately as possible?<Question>Explain your answer.<Output Format>.
DebateAllThese are the solutions from other agents:<other agent responses>. Based on the above responses with their indicated
importance, can you provide an updated answer? Examine all solutions step by step.<Output Format>.
```
