<template>
    <div class="wizard">
        <el-row>
            <el-col>
                <el-steps :active="currentStep" align-center finishStatus="success"
                          :direction="currentStepLayoutDirection">
                    <el-step v-for="(step, index) in steps" :title="step.stepTitle" :description="step.description"
                             :key="`step_${index}`"></el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div v-for="(step, index) in steps" :key="`step_slot_${index}`">
                    <slot :name="`step_${index}`" v-if="currentStep === index"></slot>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  /* ============
   * Panel Component
   * ============
   *
   * A basic panel component.
   *
   * Gives an idea how components work.
   */

  import StepLayoutDirectionMixin from '@/mixins/stepLayoutDirection';

  export default {
    mixins: [
      StepLayoutDirectionMixin,
    ],
    props: {
      steps: {
        type: Array,
        required: true,
      },

      currentStep: {
        type: Number,
        default: 0,
      },
    },
  };

</script>
